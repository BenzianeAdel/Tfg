package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.User;
import appgym.appgym.gym.model.Usuario;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.annotations.Cache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
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
    public String maquinas(Model model,@Param("busca")String busca){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        List<Maquina> maquinas = maquinaService.busquedaMaquina(busca);
        model.addAttribute("maquinas",maquinas);
        Long idu = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(idu);
        model.addAttribute("maquinaData",new MaquinaData());
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente", User.cliente);
        model.addAttribute("usuario",u);
        return "maquinas";
    }
    @GetMapping("/maquinas/{id}")
    @ResponseBody
    public Maquina obtenerMaquina(@PathVariable("id") Long id){
        Maquina m = maquinaService.findById(id);
        return m;
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
    @PostMapping("/maquinas/editar")
    public String editarMaquina(MaquinaData maquinaData, @RequestParam(value="imagen", required=false) MultipartFile imagen, BindingResult result){
        if (result.hasErrors()) {
            return "maquinas";
        }
        Maquina m = maquinaService.findById(maquinaData.getId());
        m.setNombre(maquinaData.getNombre());
        m.setRegistro(maquinaData.getRegistro());
        maquinaData.setImagen(imagen);
        if (!imagen.isEmpty()) {
            m.setImagen(imagen.getOriginalFilename());
            String carpetaImagenes = "src/main/resources/static/img/maquinas/" + m.getId();
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
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        maquinaService.editarMaquina(m);
        return "redirect:/maquinas";
    }
    @PostMapping("/maquinasMovil/editar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public String editarMaquinaMovil(@RequestParam("data")String datos, @RequestParam(value="imagen", required=false) MultipartFile imagen){
        ObjectMapper objectMapper = new ObjectMapper();
        MaquinaData maquinaData = null;
        try {
            maquinaData = objectMapper.readValue(datos, MaquinaData.class);
        } catch (JsonProcessingException e) {
        }
        Maquina m = maquinaService.findById(maquinaData.getId());
        m.setNombre(maquinaData.getNombre());
        m.setRegistro(maquinaData.getRegistro());
        maquinaData.setImagen(imagen);
        if (imagen != null) {
            m.setImagen(imagen.getOriginalFilename());
            String carpetaImagenes = "src/main/resources/static/img/maquinas/" + m.getId();
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
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        maquinaService.editarMaquina(m);
        return "redirect:/maquinas";
    }
    @PostMapping("/maquinasMovil")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void nuevaMaquinas(@RequestParam("data")String datos,@RequestPart("imagen") MultipartFile imagen){
        ObjectMapper objectMapper = new ObjectMapper();
        MaquinaData maquinaData = null;
        try {
            maquinaData = objectMapper.readValue(datos, MaquinaData.class);
        } catch (JsonProcessingException e) {
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
    }
    @PostMapping("/maquinas/eliminar")
    public String EliminarMaquina(MaquinaData maquinaData, RedirectAttributes flash){
        Maquina a = maquinaService.findById(maquinaData.getId());
        maquinaService.eliminarMaquina(a);
        flash.addFlashAttribute("correcto","Se ha eliminado correctamente la Maquina");
        return "redirect:/maquinas";
    }
    @PostMapping("/maquinasMovil/eliminar/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void EliminarMaquinaMovil(@PathVariable("id")Long idM){
        Maquina a = maquinaService.findById(idM);
        maquinaService.eliminarMaquina(a);
    }
}
