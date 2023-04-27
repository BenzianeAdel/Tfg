package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.*;
import appgym.appgym.gym.service.ActividadService;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
public class UsuarioController {
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    ActividadService actividadService;
    @Autowired
    MaquinaService maquinaService;

    @Autowired
    ManagerUserSession managerUserSession;

    private boolean comprobarLogueado(){
        if(managerUserSession.usuarioLogeado() == null){
            return false;
        }
        return true;
    }
    private void eliminarPerfil(Long id){
        Usuario u = usuarioService.findById(id);
        if(u.getTipoUser()==User.cliente){
            usuarioService.eliminarRelacionesCliente(u);
        }
        else{
            if (u.getTipoUser()==User.monitor){
                usuarioService.eliminarRelacionesMonitor(u);
            }
        }
        usuarioService.eliminarUsuario(u);
    }
    @GetMapping("/home")
    public String home(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        if(u.getTipoUser() == User.admin){
            model.addAttribute("tipo",0);
        } else if (u.getTipoUser() == User.monitor) {
            model.addAttribute("tipo",2);
        } else{
          model.addAttribute("tipo",1);
        }
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        model.addAttribute("monitores",usuarioService.findAllTip(User.monitor,null).size());
        model.addAttribute("admins",usuarioService.findAllTip(User.admin,null).size());
        model.addAttribute("clientes",usuarioService.findAllTip(User.cliente,null).size());
        model.addAttribute("actividades",actividadService.findAll().size());
        model.addAttribute("reservacion",actividadService.findAllReservas().size());
        model.addAttribute("rutinas",actividadService.findAllRutinas().size());
        model.addAttribute("maquinas",maquinaService.findAll().size());
        return "home";
    }
    @GetMapping("/perfil")
    public String perfil(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Long idu = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(idu);
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        model.addAttribute("opciones", ZonaCuerpo.values());
        model.addAttribute("enfermedades",u.getEnfermedades());
        model.addAttribute("usuarioData",new UsuarioData());
        model.addAttribute("enfermedadData",new EnfermedadData());
        return "perfil";
    }
    @PostMapping("/enfermedades")
    public String enfermedades(EnfermedadData enfermedadData){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        Enfermedades e = new Enfermedades();
        e.setUsuario(u);
        e.setLesion(enfermedadData.getLesion());
        e.setZonaEvitar(enfermedadData.getZonaEvitar());
        usuarioService.registrar(e);
        return "redirect:/perfil";
    }
    @PostMapping("/enfermedades/{idE}/borrar")
    public String enfermedadesEliminar(@PathVariable("idE") Long idE){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        Enfermedades e = usuarioService.findByIdEnfermedad(idE);
        usuarioService.eliminarEnfermedad(e);
        return "redirect:/perfil";
    }
    @PostMapping("/enfermedadesMovil/{idE}/borrar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void enfermedadesMovilEliminar(@PathVariable("idE") Long idE){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        Enfermedades e = usuarioService.findByIdEnfermedad(idE);
        usuarioService.eliminarEnfermedad(e);
    }
    @PostMapping("/enfermedadesMovil")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void enfermedadesMovil(@RequestBody EnfermedadData enfermedadData){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        Enfermedades e = new Enfermedades();
        e.setUsuario(u);
        e.setLesion(enfermedadData.getLesion());
        e.setZonaEvitar(enfermedadData.getZonaEvitar());
        usuarioService.registrar(e);
    }
    @GetMapping("/enfermedadesMovil")
    @ResponseBody
    public List<Enfermedades>getEnfermedades(){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        return u.getEnfermedades();
    }
    @GetMapping("/tipoUsuariosMovil")
    @ResponseBody
    public User[] getTipoUsuarios(){
        return User.values();
    }
    @GetMapping("/zonasCuerpoMovil")
    @ResponseBody
    public ZonaCuerpo[] zonas(){
        return ZonaCuerpo.values();
    }
    @GetMapping("/usuarios/{id}")
    @ResponseBody
    public Usuario obtenerUsuario(@PathVariable("id") Long id){
        Usuario u = usuarioService.findById(id);
        return u;
    }
    @PostMapping("/update")
    public String EditarUsuario(@Valid UsuarioData usuarioData, RedirectAttributes flash){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setAcceso(usuarioData.getAcceso());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setEmail(usuarioData.geteMail());
        u.setFechaNacimiento(usuarioData.getFechaNacimiento());
        u.setPassword(usuarioData.getPassword());
        Usuario usuario = usuarioService.findByEmail(usuarioData.geteMail());
        if(usuario == null){
            usuarioService.editarUsuario(u);
        } else if (usuario != null && usuario.getId() == usuarioData.getId()) {
            usuarioService.editarUsuario(u);
        } else{
            flash.addFlashAttribute("error", "El usuario " + usuarioData.geteMail() + " ya existe");
        }
        return "redirect:/users";
    }
    @PostMapping("/usuarioEditarMovil")
    @ResponseBody
    public ResponseEntity<Object> editarPerfilUsuario(@RequestBody UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setAcceso(usuarioData.getAcceso());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setEmail(usuarioData.geteMail());
        u.setPassword(usuarioData.getPassword());
        Usuario usuario = usuarioService.findByEmail(usuarioData.geteMail());
        if(usuario == null){
            usuarioService.editarUsuario(u);
            ApiResponse response = new ApiResponse("El cambio se ha realizado correctamente");
            return ResponseEntity.ok().body(response);
        } else if (usuario != null && usuario.getId() == usuarioData.getId()) {
            usuarioService.editarUsuario(u);
            ApiResponse response = new ApiResponse("El cambio se ha realizado correctamente");
            return ResponseEntity.ok().body(response);
        } else{
            ApiResponse response = new ApiResponse("El usuario " + usuarioData.geteMail() + " ya existe");
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/perfil/editar")
    public String EditarPerfil(@Valid UsuarioData usuarioData,RedirectAttributes flash){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setAcceso(usuarioData.getAcceso());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setEmail(usuarioData.geteMail());
        u.setFechaNacimiento(usuarioData.getFechaNacimiento());
        u.setPassword(usuarioData.getPassword());
        Usuario usuario = usuarioService.findByEmail(usuarioData.geteMail());
        if(usuario == null){
            usuarioService.editarUsuario(u);
        } else if (usuario != null && usuario.getId() == usuarioData.getId()) {
            usuarioService.editarUsuario(u);
        } else{
            flash.addFlashAttribute("error", "El usuario " + usuarioData.geteMail() + " ya existe");
        }
        return "redirect:/perfil";
    }
    @PostMapping(  value="/perfil/editar",consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Object> editarPerfilMovil(@RequestBody UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setEmail(usuarioData.geteMail());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setPassword(usuarioData.getPassword());
        Usuario usuario = usuarioService.findByEmail(usuarioData.geteMail());
        if(usuario == null){
            usuarioService.editarUsuario(u);
            return ResponseEntity.ok().body(u);
        } else if (usuario != null && usuario.getId() == usuarioData.getId()) {
            usuarioService.editarUsuario(u);
            return ResponseEntity.ok().body(u);
        } else{
            ApiResponse response = new ApiResponse("El usuario " + usuarioData.geteMail() + " ya existe");
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/eliminar")
    public String EliminarUsuario(UsuarioData usuarioData){
        eliminarPerfil(usuarioData.getId());
        return "redirect:/users";
    }
    @PostMapping("/perfil/eliminar")
    public String Eliminarperfil(UsuarioData usuarioData){
        eliminarPerfil(usuarioData.getId());
        managerUserSession.logout();
        return "redirect:/login";
    }
    @PostMapping("/perfilMovil/eliminar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void EliminarperfilMovil(){
        eliminarPerfil(managerUserSession.usuarioLogeado());
        managerUserSession.logout();
    }
    @PostMapping("/usuarioMovil/eliminar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarUsuarioPerfilMovil(@PathVariable("id")Long idU){
        eliminarPerfil(idU);
    }
    @GetMapping("/users")
    public String users(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        List<Usuario> cl = usuarioService.findAllTip(User.cliente,null);
        List<Usuario> admins = usuarioService.findAllTip(User.admin,null);
        List<Usuario> mon = usuarioService.findAllTip(User.monitor,null);
        Long idu = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(idu);
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        model.addAttribute("admins",admins);
        model.addAttribute("clientes",cl);
        model.addAttribute("monitores",mon);
        model.addAttribute("usuarioData", new UsuarioData());
        model.addAttribute("opciones", User.values());
        model.addAttribute("birthdate", LocalDate.now().minusYears(18));
        return "users";
    }
    @GetMapping("/usuariosMovil")
    @ResponseBody
    public List<Usuario> usuariosMovil(){
        List<Usuario> usuarios = usuarioService.findAll();
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        usuarios.remove(u);
        return usuarios;
    }

    @GetMapping("/ranking")
    public String ranking(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Long idu = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(idu);
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        List<Usuario>users = usuarioService.findAllTip(User.cliente,null);
        Collections.sort(users, Comparator.comparing(Usuario::getPuntos).reversed());
        model.addAttribute("users",users);
        return "ranking";
    }
    @GetMapping("/rankingUsersMovil")
    @ResponseBody
    public List<Usuario> rankingMovil(Model model){
        List<Usuario>users = usuarioService.findAllTip(User.cliente,null);
        Collections.sort(users, Comparator.comparing(Usuario::getPuntos).reversed());
        model.addAttribute("users",users);
        return users;
    }
    @GetMapping("/amigos")
    public String amigos(Model model,@Param("busca")String busca){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        List<Usuario>usuarios = usuarioService.buscador(busca,User.cliente,id);
        List<Usuario>noamigos = usuarioService.noamigos(usuarios,id);
        List<Usuario>amigos = usuarioService.misamigos(usuarios,id);
        List<Usuario> usersRankings = new ArrayList<>(amigos);
        usersRankings.add(u);
        Collections.sort(usersRankings, Comparator.comparing(Usuario::getPuntos).reversed());
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        model.addAttribute("amigos",amigos);
        model.addAttribute("usuarios",noamigos);
        model.addAttribute("friends",usersRankings);
        return "amigos";
    }
    @GetMapping("/usuarios")
    @ResponseBody
    public List<Usuario> usuarios(){
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        List<Usuario> cl = usuarioService.findAllTip(User.cliente,id);
        List<Usuario>noamigos = usuarioService.noamigos(cl,id);
        return noamigos;
    }
    @GetMapping("/misamigos")
    @ResponseBody
    public List<Usuario> misamigos(){
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        List<Usuario> cl = usuarioService.findAllTip(User.cliente,id);
        List<Usuario>amigos = usuarioService.misamigos(cl,id);
        return amigos;
    }
    @GetMapping("/rankingAmigos")
    @ResponseBody
    public List<Usuario> rankingAmigos(){
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        List<Usuario> cl = usuarioService.findAllTip(User.cliente,id);
        List<Usuario>amigos = usuarioService.misamigos(cl,id);
        List<Usuario> usersRankings = new ArrayList<>(amigos);
        usersRankings.add(u);
        Collections.sort(usersRankings, Comparator.comparing(Usuario::getPuntos).reversed());
        return usersRankings;
    }

    @PostMapping("/amigos/seguir/{id}")
    public String amigos(@PathVariable(value="id") Long idUsuario){
        Long id = managerUserSession.usuarioLogeado();
        usuarioService.seguirAmigo(idUsuario,id);
        return "redirect:/amigos";
    }
    @PostMapping("/amigosMovil/seguir/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void amigosMovil(@PathVariable(value="id") Long idUsuario){
        Long id = managerUserSession.usuarioLogeado();
        usuarioService.seguirAmigo(idUsuario,id);
    }
    @DeleteMapping("/amigos/dejar/{id}")
    public String dejar(@PathVariable(value="id") Long idUsuario){
        Long id = managerUserSession.usuarioLogeado();
        usuarioService.dejarAmigo(idUsuario,id);
        return "redirect:/amigos";
    }
    @DeleteMapping("/amigosMovil/dejar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void dejarMovil(@PathVariable(value="id") Long idUsuario){
        Long id = managerUserSession.usuarioLogeado();
        usuarioService.dejarAmigo(idUsuario,id);
    }
}
