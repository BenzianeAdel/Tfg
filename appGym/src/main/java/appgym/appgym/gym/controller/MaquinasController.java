package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.io.File;

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
        model.addAttribute("maquinaData",new MaquinaData());
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
    @PostMapping("/maquinas")
    public String nuevaMaquinas(MaquinaData maquinaData, @RequestParam("imagen") MultipartFile imagen, BindingResult result){
        if (result.hasErrors()) {
            return "maquinas";
        }

        Maquina m = new Maquina();
        m.setImagen(imagen.getOriginalFilename());
        m.setNombre(maquinaData.getNombre());
        m.setRegistro(maquinaData.getRegistro());
        maquinaService.registrar(m);

        if (!imagen.isEmpty()) {
            try {
                byte[] bytesImagen = imagen.getBytes();
                Path rutaCarpeta = Paths.get("src/main/resources/static/img/maquinas/"+m.getId()+"/");
                Path rutaImagen = Paths.get(rutaCarpeta.toString() + imagen.getOriginalFilename());
                // Verifica si la carpeta existe y si no la crea
                if (!Files.exists(rutaCarpeta)) {
                    Files.createDirectories(rutaCarpeta);
                }
                Path rutaFinal = Paths.get("src/main/resources/static/img/maquinas/"+m.getId()+"/"+imagen.getOriginalFilename());
                Files.write(rutaFinal, bytesImagen);
                maquinaData.setImagen(imagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "redirect:/maquinas";
    }
    @PostMapping("/maquinas/eliminar")
    public String EliminarMaquina(MaquinaData maquinaData, RedirectAttributes flash){
        Maquina a = maquinaService.findById(maquinaData.getId());
        maquinaService.eliminarMaquina(a);
        String carpetaImagenes = "src/main/resources/static/img/maquinas/" + maquinaData.getId();
        Path pathCarpeta = Paths.get(carpetaImagenes);
        File carpeta = new File(carpetaImagenes);
        if(carpeta.exists() && carpeta.isDirectory()){
            try {
                Files.walk(pathCarpeta)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        flash.addFlashAttribute("correcto","Se ha eliminado correctamente la Maquina");
        return "redirect:/maquinas";
    }
}
