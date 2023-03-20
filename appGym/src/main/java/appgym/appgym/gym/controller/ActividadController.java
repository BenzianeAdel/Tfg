package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.*;
import appgym.appgym.gym.service.ActividadService;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.annotation.MultipartConfig;
import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ActividadController {
    @Autowired
    ActividadService actividadService;
    @Autowired
    ManagerUserSession managerUserSession;
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    MaquinaService maquinaService;
    @GetMapping("/actividades")
    public String actividades(Model model){
        boolean tipoC = false;
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        if(u.getTipoUser()==User.cliente){
            tipoC = true;
        }
        List<Actividad> actividades = actividadService.findAll();
        List<Maquina> maquinas = maquinaService.findAll();
        List<Usuario> monitores = usuarioService.findAllTip(User.monitor,null);
        List<Reservation>reservas = actividadService.findActividades(u);
        model.addAttribute("reservas",reservas);
        model.addAttribute("tipo",tipoC);
        model.addAttribute("actividades",actividades);
        model.addAttribute("actividadData",new ActividadData());
        model.addAttribute("maquinas",maquinas);
        model.addAttribute("monitores",monitores);
        model.addAttribute("opciones",ZonaCuerpo.values());
        model.addAttribute("estado",Estado.Finalizada);
        model.addAttribute("reservaData",new ReservaData());
        model.addAttribute("valorarData",new ValorarData());
        Collections.sort(actividades, Comparator.comparing(Actividad::getPuntos).reversed());
        model.addAttribute("mejores",actividades.stream().limit(5).collect(Collectors.toList()));
        return "actividad";
    }
    @GetMapping("/misactividades")
    public List<Reservation> misactividades(Model model){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        List<Actividad> actividades = actividadService.findAll();
        List<Reservation>reservas = actividadService.findActividades(u);
        return reservas;
    }
    @GetMapping("/actividadesMovil")
    @ResponseBody
    public List<Actividad> actividadesMovil(Model model){
        List<Actividad> actividades = actividadService.findAll();
        return actividades;
    }
    @GetMapping("/actividades/destacadas")
    @ResponseBody
    public List<Actividad> actividadesDestacadasMovil(){
        List<Actividad> actividades = actividadService.findAll();
        Collections.sort(actividades, Comparator.comparing(Actividad::getPuntos).reversed());
        return actividades.stream().limit(5).collect(Collectors.toList());
    }
    @GetMapping("/monitores")
    @ResponseBody
    public List<Usuario> monitores(){
        List<Usuario> monitores = usuarioService.findAllTip(User.monitor,null);
        return monitores;
    }
    @PostMapping("/actividades")
    public String nuevaActividad(ActividadData actividadData, @RequestParam("imagen") MultipartFile imagen, BindingResult result){
        if (result.hasErrors()) {
            return "actividad";
        }
        if (!imagen.isEmpty()) {
            try {
                byte[] bytesImagen = imagen.getBytes();
                Path rutaImagen = Paths.get("src/main/resources/static/img/" + imagen.getOriginalFilename());
                Files.write(rutaImagen, bytesImagen);
                actividadData.setImagen(imagen);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Actividad a = new Actividad();
        a.setImagen(imagen.getOriginalFilename());
        a.setNombre(actividadData.getNombre());
        a.setSeries(actividadData.getSeries());
        a.setRepeticiones(actividadData.getRepeticiones());
        a.setMaquina(actividadData.getMaquina());
        a.setZonaCuerpo(actividadData.getZonaCuerpo());
        actividadService.registrar(a);
        return "redirect:/actividades";
    }
    @PostMapping("/reservar")
    public String reservar(@Valid ReservaData reservaData){
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        Reservation r = new Reservation();
        r.setTitle(reservaData.getTitle());
        r.setCliente(u);
        r.setStart(reservaData.getFecha());
        r.setMonitor(reservaData.getIdMonitor());
        r.setActividad(reservaData.getIdActividad());
        r.setEstado(Estado.Pendiente);
        r.setValorada(false);
        actividadService.registrar(r);
        return "redirect:/actividades";
    }
    @PostMapping("/reservar/finalizar/{id}")
    public String finalizar(@PathVariable(value="id") Long idReserva){
        Reservation r = actividadService.finalizarReserva(idReserva);
        usuarioService.subirPuntos(r);
        return "redirect:/actividades";
    }
    @PostMapping("/valorar/{idR}/{idA}")
    public String valorar(@Valid ValorarData valorarData,@PathVariable(value="idR") Long idReserva,@PathVariable(value="idA") Long idActividad){
        actividadService.valorar(idActividad,valorarData.getPuntos(),idReserva);
        return "redirect:/actividades";
    }
}
