package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.service.MaquinaService;
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
    @GetMapping("/maquinas")
    public String maquinas(Model model){
        List<Maquina> maquinas = maquinaService.findAll();
        model.addAttribute("maquinas",maquinas);
        return "maquinas";
    }
    @GetMapping("/maquinasSala")
    @ResponseBody
    public List<Maquina> maquinasMovil(){
        List<Maquina> maquinas = maquinaService.findAll();
        return maquinas;
    }
}
