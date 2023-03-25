package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Mensajes;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.UsuarioService;
import appgym.appgym.gym.service.MensajesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.time.Instant;
import java.util.Date;
import java.util.List;

@Controller
public class MensajesController {
    @Autowired
    MensajesService mensajesService;
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

    @GetMapping("/mensajes")
    public String mensajes(Model model,@Param("buscarContacto")String busca){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        List<Usuario> usuarios = usuarioService.findContactos(managerUserSession.usuarioLogeado(),busca);
        List<Mensajes> mensajes = mensajesService.getMensajesPorUsuario(u.getId(),managerUserSession.usuarioLogeado());
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuarios",usuarios);
        model.addAttribute("usuario",u);
        model.addAttribute("messages", mensajes);
        model.addAttribute("user",u);
        model.addAttribute("currentUser",managerUserSession.usuarioLogeado());
        model.addAttribute("mensajeData",new MensajeData());
        return "mensajes";
    }
    @PostMapping("/chat/{userId}")
    public String enviarMensaje(@PathVariable Long userId, MensajeData mensajeData) {
        Usuario usuarioReceptor = usuarioService.findById(userId);
        Usuario usuarioEmisor = usuarioService.findById(managerUserSession.usuarioLogeado());
        Mensajes mensajeNuevo = new Mensajes();
        mensajeNuevo.setReceptor(usuarioReceptor);
        mensajeNuevo.setEmisor(usuarioEmisor);
        mensajeNuevo.setTexto(mensajeData.getTexto());
        mensajeNuevo.setFecha(LocalDateTime.now());
        mensajesService.registrar(mensajeNuevo);
        return "redirect:/chat/" + userId;
    }
    @GetMapping("/chat/{userId}")
    public String showChatPage(@PathVariable Long userId, Model model,@Param("buscarContacto")String busca) {
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        // Recupera los mensajes y otra información relevante del usuario correspondiente.
        Usuario usuario = usuarioService.findById(userId);
        List<Mensajes> mensajes = mensajesService.getMensajesPorUsuario(userId,managerUserSession.usuarioLogeado());

        List<Usuario> usuarios = usuarioService.findContactos(managerUserSession.usuarioLogeado(),busca);
        model.addAttribute("usuarios",usuarios);
        model.addAttribute("esAdmin", User.admin);
        model.addAttribute("usuario",u);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("mensajeData",new MensajeData());
        // Agrega el usuario y los mensajes al modelo para que se puedan mostrar en la página de chat.
        model.addAttribute("user", usuario);
        model.addAttribute("currentUser",managerUserSession.usuarioLogeado());
        model.addAttribute("messages", mensajes);

        // Devuelve el nombre de la plantilla Thymeleaf para construir la página de chat.
        return "mensajes";
    }
    @PostMapping("/mensajes/{destino}")
    public String envioMensaje(@PathVariable(value="destino") Long idUsuario,MensajeData mensajeData){
        Long id = managerUserSession.usuarioLogeado();
        Usuario emisor = usuarioService.findById(id);
        Usuario dest = usuarioService.findById(idUsuario);
        Mensajes m = new Mensajes();
        m.setEmisor(emisor);
        m.setTexto(mensajeData.getTexto());
        m.setReceptor(dest);
        LocalDateTime now = LocalDateTime.now();
        m.setFecha(now);
        mensajesService.registrar(m);
        return "redirect:/mensajes";
    }
}
