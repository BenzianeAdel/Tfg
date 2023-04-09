package appgym.appgym.gym.controller;


import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.service.ActividadService;
import appgym.appgym.gym.service.MaquinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PrincipalController {
    @Autowired
    ManagerUserSession managerUserSession;
    @Autowired
    ActividadService actividadService;

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
    public String contacto(){
        if(comprobarLogueado()){
            return "redirect:/home";
        }
        return "contacto";
    }
}
