package appgym.appgym.gym.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PrincipalController {
    @GetMapping("/")
    public String principal() {
        return "principal";
    }
    @GetMapping("/acerca")
    public String acerca(){return "acerca";}
    @GetMapping("/sobremi")
    public String sobreMi(){return "sobremi";}
    @GetMapping("/contacto")
    public String contacto(){return "contacto";}
}
