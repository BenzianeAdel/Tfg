package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    ManagerUserSession managerUserSession;

    private boolean comprobarLogueado(){
        if(managerUserSession.usuarioLogeado() == null){
            return false;
        }
        return true;
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
        model.addAttribute("usuarioData",new UsuarioData());
        return "perfil";
    }
    @GetMapping("/usuarios/{id}")
    @ResponseBody
    public Usuario obtenerUsuario(@PathVariable("id") Long id){
        Usuario u = usuarioService.findById(id);
        return u;
    }
    @PostMapping("/update")
    public String EditarUsuario(@Valid UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setAcceso(usuarioData.getAcceso());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setEmail(usuarioData.geteMail());
        u.setFechaNacimiento(usuarioData.getFechaNacimiento());
        u.setPassword(usuarioData.getPassword());
        usuarioService.editarUsuario(u);
        return "redirect:/users";
    }
    @PostMapping("/perfil/editar")
    public String EditarPerfil(@Valid UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setAcceso(usuarioData.getAcceso());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setEmail(usuarioData.geteMail());
        u.setFechaNacimiento(usuarioData.getFechaNacimiento());
        u.setPassword(usuarioData.getPassword());
        usuarioService.editarUsuario(u);
        return "redirect:/perfil";
    }
    @PostMapping(  value="/perfil/editar",consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Usuario editarPerfilMovil(@Valid@RequestBody UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        u.setEmail(usuarioData.geteMail());
        u.setNombre(usuarioData.getNombre());
        u.setApellidos(usuarioData.getApellidos());
        u.setPassword(usuarioData.getPassword());
        usuarioService.editarUsuario(u);
        return u;
    }
    @PostMapping("/eliminar")
    public String EliminarUsuario(UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        usuarioService.eliminarUsuario(u);
        return "redirect:/users";
    }
    @PostMapping("/perfil/eliminar")
    public String Eliminarperfil(UsuarioData usuarioData){
        Usuario u = usuarioService.findById(usuarioData.getId());
        if(u.getTipoUser()==User.cliente){
            usuarioService.eliminarRelacionesCliente(u);
        }
        else{
            if (u.getTipoUser()==User.monitor){
                usuarioService.eliminarRelacionesMonitor(u);
            }
        }
        usuarioService.eliminarUsuario(u);
        return "redirect:/login";
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
