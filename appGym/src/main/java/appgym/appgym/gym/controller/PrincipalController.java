package appgym.appgym.gym.controller;


import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.ActividadService;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;

@Controller
public class PrincipalController {
    @Autowired
    ManagerUserSession managerUserSession;
    @Autowired
    ActividadService actividadService;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    MaquinaService maquinaService;
    private boolean comprobarLogueado(){
        if(managerUserSession.usuarioLogeado() == null){
            return false;
        }
        return true;
    }
    @GetMapping("/")
    public String principal(Model model) {
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        model.addAttribute("multimedia",actividadService.findAllImagenes());
        model.addAttribute("maquinas",maquinaService.findAll());
        return "principal";
    }
    @GetMapping("/acerca")
    public String acerca(){
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        return "acerca";
    }
    @GetMapping("/sobremi")
    public String sobreMi(){
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        return "sobremi";
    }
    @GetMapping("/contacto")
    public String contacto(Model model){
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        model.addAttribute("contactoData",new ContactoData());
        return "contacto";
    }
    @PostMapping("/contacto")
    public String contactoSubmit(ContactoData contactoData, RedirectAttributes flash) throws MessagingException, UnsupportedEncodingException {
        usuarioService.sendContacto(contactoData);
        flash.addFlashAttribute("mensaje","Correo enviado correctamente al administrador");
        return "redirect:/contacto";
    }
}
