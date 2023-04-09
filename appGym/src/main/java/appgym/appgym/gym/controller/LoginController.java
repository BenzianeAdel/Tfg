package appgym.appgym.gym.controller;
import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.UsuarioService;
import appgym.appgym.gym.service.LoginStatus;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;

@Controller
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    UsuarioService usuarioService;
    @Autowired
    ManagerUserSession managerUserSession;

    private boolean comprobarLogueado(){
        if(managerUserSession.usuarioLogeado() == null){
            return false;
        }
        return true;
    }
    @GetMapping("/login")
    public String loginForm(Model model) {
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        model.addAttribute("loginData", new LoginData());
        return "formLogin";
    }


    @PostMapping(  value="/login",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String loginSubmit(@ModelAttribute LoginData loginData, Model model, HttpSession session) {

        // Llamada al servicio para comprobar si el login es correcto
        LoginStatus loginStatus = usuarioService.login(loginData.geteMail(), loginData.getPassword());
        if(loginStatus == LoginStatus.USER_NOT_FOUND){
            model.addAttribute("errorLogin", "No existe usuario");
            return "formLogin";
        } else if (loginStatus == LoginStatus.LOGIN_OK) {
            Usuario usuario = usuarioService.findByEmail(loginData.geteMail());
            managerUserSession.logearUsuario(usuario.getId());
            return "redirect:/home";
        } else if (loginStatus == LoginStatus.ERROR_PASSWORD) {
            model.addAttribute("errorLogin", "Contraseña incorrecta");
            return "formLogin";
        } else if (loginStatus == LoginStatus.ERROR_BLOQUEADO){
            model.addAttribute("errorLogin","El usuario esta bloqueado contacte con el administrador");
            return "formLogin";
        } else if (loginStatus == LoginStatus.CUENTA_DESACTIVADA){
            model.addAttribute("errorLogin","Activala verificando el email");
            return "formLogin";
        }
        return "formLogin";
    }
    @PostMapping(  value="/login",consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> loginSubmitMovil(@RequestBody LoginData loginData, HttpSession session) {

        // Llamada al servicio para comprobar si el login es correcto
        LoginStatus loginStatus = usuarioService.login(loginData.geteMail(), loginData.getPassword());

        if (loginStatus == LoginStatus.LOGIN_OK) {
            Usuario usuario = usuarioService.findByEmail(loginData.geteMail());
            managerUserSession.logearUsuario(usuario.getId());
            return ResponseEntity.ok().body(usuario);
        } else if (loginStatus == LoginStatus.USER_NOT_FOUND) {
            ApiResponse response = new ApiResponse("No existe usuario con ese email");
            return ResponseEntity.badRequest().body(response);
        } else if (loginStatus == LoginStatus.ERROR_PASSWORD) {
            ApiResponse response = new ApiResponse("Contraseña incorrecta");
            return ResponseEntity.badRequest().body(response);
        } else if (loginStatus == LoginStatus.ERROR_BLOQUEADO){
            ApiResponse response = new ApiResponse("Usuario Bloqueado, contacta con administrador");
            return ResponseEntity.badRequest().body(response);
        } else if (loginStatus == LoginStatus.CUENTA_DESACTIVADA){
            ApiResponse response = new ApiResponse("Cuenta desactivada, Activala verificando el email");
            return ResponseEntity.badRequest().body(response);
        }
        ApiResponse response = new ApiResponse("Error del servidor");
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/registro")
    public String registroForm(Model model) {
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        model.addAttribute("usuarioData", new UsuarioData());
        model.addAttribute("birthdate", LocalDate.now().minusYears(18));
        return "formRegistro";
    }

    @PostMapping("/registro")
    public String registroSubmit(@Valid UsuarioData usuarioData, BindingResult result, Model model, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {

        if (result.hasErrors()) {
            return "formRegistro";
        }

        if (usuarioService.findByEmail(usuarioData.geteMail()) != null) {
            model.addAttribute("error", "El usuario " + usuarioData.geteMail() + " ya existe");
            return "formRegistro";
        }
        Usuario usuario = new Usuario();
        usuario.setPassword(usuarioData.getPassword());
        usuario.setFechaNacimiento(usuarioData.getFechaNacimiento());
        usuario.setNombre(usuarioData.getNombre());
        usuario.setEmail(usuarioData.geteMail());
        usuario.setApellidos(usuarioData.getApellidos());
        usuario.setAcceso(true);
        String randomCode = RandomString.make(64);
        usuario.setVerificationCode(randomCode);
        String url = usuarioService.getSiteURL(req);
        usuarioService.sendVerificationEmail(usuario,url);
        usuario.setTipoUser(User.cliente);
        usuarioService.registrar(usuario);
        return "registro_check";
    }
    @PostMapping("/registroMovil")
    @ResponseBody
    public ResponseEntity<Object> registroMovilSubmit(@RequestBody UsuarioData usuarioData,HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {

        if (usuarioService.findByEmail(usuarioData.geteMail()) != null) {
            ApiResponse response = new ApiResponse("El usuario " + usuarioData.geteMail() + " ya existe");
            return ResponseEntity.badRequest().body(response);
        }
        else {
            Usuario usuario = new Usuario();
            usuario.setPassword(usuarioData.getPassword());
            usuario.setFechaNacimiento(usuarioData.getFechaNacimiento());
            usuario.setNombre(usuarioData.getNombre());
            usuario.setEmail(usuarioData.geteMail());
            usuario.setApellidos(usuarioData.getApellidos());
            usuario.setAcceso(true);
            String randomCode = RandomString.make(64);
            usuario.setVerificationCode(randomCode);
            String url = usuarioService.getSiteURL(req);
            usuarioService.sendVerificationEmail(usuario, url);
            usuario.setTipoUser(User.cliente);
            usuarioService.registrar(usuario);
            ApiResponse response = new ApiResponse("Por favor verifique su correo para completar el registro");
            return ResponseEntity.ok().body(response);
        }
    }
    @PostMapping("/newUser")
    public String registroNewSubmit(@Valid UsuarioData usuarioData, BindingResult result, Model model, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {

        if (result.hasErrors()) {
            return "redirect:/users";
        }

        if (usuarioService.findByEmail(usuarioData.geteMail()) != null) {
            model.addAttribute("usuarioData", usuarioData);
            model.addAttribute("error", "El usuario " + usuarioData.geteMail() + " ya existe");
            return "redirect:/users";
        }
        Usuario usuario = new Usuario();
        usuario.setPassword(usuarioData.getPassword());
        usuario.setFechaNacimiento(usuarioData.getFechaNacimiento());
        usuario.setNombre(usuarioData.getNombre());
        usuario.setEmail(usuarioData.geteMail());
        usuario.setApellidos(usuarioData.getApellidos());
        usuario.setAcceso(true);
        usuario.setEnabled(true);
        usuario.setTipoUser(usuarioData.getUser());
        usuarioService.registrar(usuario);
        return "redirect:/users";
    }

    @GetMapping("/olvidar")
    public String olvidarForm(Model model) {
        model.addAttribute("resetData", new UsuarioData());
        return "formOlvidar";
    }
    @PostMapping("/olvidar")
    public String enviarCorreo(@ModelAttribute UsuarioData resetData, RedirectAttributes flash, Model model, HttpSession session, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        Usuario user = usuarioService.findByEmail(resetData.geteMail());

        if(user == null){
            flash.addFlashAttribute("error", "No existe el correo en el sistema");
            return "redirect:/olvidar";
        }
        else{
            String url = usuarioService.getSiteURL(req);
            usuarioService.sendRessetEmail(user,url);
            flash.addFlashAttribute("mensaje", "Correo enviado correctamente");
            return "redirect:/olvidar";
        }
    }
    @PostMapping("/olvidarMovil")
    @ResponseBody
    public ResponseEntity<Object> enviarCorreoMovil(@RequestBody UsuarioData resetData, HttpServletRequest req) throws MessagingException, UnsupportedEncodingException {
        Usuario user = usuarioService.findByEmail(resetData.geteMail());

        if(user == null){
            ApiResponse response = new ApiResponse("No existe el correo en el sistema");
            return ResponseEntity.badRequest().body(response);
        }
        else{
            String url = usuarioService.getSiteURL(req);
            usuarioService.sendRessetEmail(user,url);
            ApiResponse response = new ApiResponse("Correo enviado, ya puede restablecer");
            return ResponseEntity.ok().body(response);
        }
    }
    @GetMapping("/verify")
    public String verifyUser(@Param("code") String code) {
        if (usuarioService.verify(code)) {
            return "verify_success";
        } else {
            return "verify_fail";
        }
    }
    @GetMapping("/ressetPassword/{idUser}")
    public String resetPassword(@PathVariable("idUser") Long uid,Model model) {
        model.addAttribute("newPasswordData", new UsuarioData());
        model.addAttribute("userId",uid);
        return "formNewPassword";
    }
    @PostMapping("/ressetPassword/{idUser}")
    public String resetPassword(@PathVariable("idUser") Long uid, RedirectAttributes flash, @ModelAttribute UsuarioData newPasswordData, Model model, HttpSession session) {
        Usuario user = usuarioService.findById(uid);
        if(user == null){
            flash.addFlashAttribute("error","No se ha podido realizar el cambio de contraseña");
            return "redirect:/olvidar";
        }else{
            usuarioService.resetPassword(user.getId(),newPasswordData.getPassword());
            flash.addFlashAttribute("mensaje","Contraseña restablecida correctamente");
            return "redirect:/login";
        }
    }
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        managerUserSession.logout();
        return "redirect:/login";
    }
    @GetMapping("/logoutMovil")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutMovil(HttpSession session) {
        managerUserSession.logout();
    }
}
