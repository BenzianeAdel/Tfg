package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Mensajes;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.UsuarioService;
import appgym.appgym.gym.service.MensajesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.time.Instant;
import java.util.List;

@Controller
public class MensajesController {
    @Autowired
    MensajesService mensajesService;
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    ManagerUserSession managerUserSession;

    @GetMapping("/mensajes")
    public String mensajes(Model model){
        List<Usuario> usuarios = usuarioService.findAll();
        List<Mensajes>mensajes = mensajesService.findAll();
        model.addAttribute("usuarios",usuarios);
        model.addAttribute("messages",mensajes);
        model.addAttribute("currentUser",managerUserSession.usuarioLogeado());
        model.addAttribute("mensajeData",new MensajeData());
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
