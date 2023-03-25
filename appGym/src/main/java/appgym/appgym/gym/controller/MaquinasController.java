package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class MaquinasController {
    @Autowired
    MaquinaService maquinaService;
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
    @GetMapping("/maquinas")
    public String maquinas(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        List<Maquina> maquinas = maquinaService.findAll();
        model.addAttribute("maquinas",maquinas);
        Long idu = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(idu);
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente", User.cliente);
        model.addAttribute("usuario",u);
        return "maquinas";
    }
    @GetMapping("/maquinasSala")
    @ResponseBody
    public List<Maquina> maquinasMovil(){
        List<Maquina> maquinas = maquinaService.findAll();
        return maquinas;
    }
}
