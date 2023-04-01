package appgym.appgym.gym.controller;

import appgym.appgym.gym.authentication.ManagerUserSession;
import appgym.appgym.gym.model.*;
import appgym.appgym.gym.service.ActividadService;
import appgym.appgym.gym.service.MaquinaService;
import appgym.appgym.gym.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.annotation.MultipartConfig;
import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
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


    private boolean comprobarLogueado(){
        if(managerUserSession.usuarioLogeado() == null){
            return false;
        }
        return true;
    }
    @GetMapping("/actividades")
    public String actividades(Model model){
        if(!comprobarLogueado()){
            return "redirect:/login";
        }
        boolean tipoC = false;
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        if(u.getTipoUser()==User.cliente){
            tipoC = true;
        }
        List<Actividad> actividades = actividadService.findAll();
        List<Maquina> maquinas = maquinaService.findAll();
        List<Usuario> monitores = usuarioService.findAllTip(User.monitor,null);
        List<Rutina> rutinas = actividadService.findAllRutinas();
        List<Reservation>reservas = actividadService.findActividades(u);
        List<Reservation>reservasPA= actividadService.findAllReservas();
        model.addAttribute("reservas",reservas);
        model.addAttribute("adminR",reservasPA);
        model.addAttribute("tipo",tipoC);
        model.addAttribute("esAdmin",User.admin);
        model.addAttribute("esCliente",User.cliente);
        model.addAttribute("usuario",u);
        model.addAttribute("actividades",actividades);
        model.addAttribute("rutinas",rutinas);
        model.addAttribute("actividadData",new ActividadData());
        model.addAttribute("actividadDataEliminar",new ActividadData());
        model.addAttribute("rutinaData",new RutinaData());
        model.addAttribute("ejercicios",actividades);
        model.addAttribute("maquinas",maquinas);
        model.addAttribute("monitores",monitores);
        model.addAttribute("opciones",ZonaCuerpo.values());
        model.addAttribute("estado",Estado.Finalizada);
        model.addAttribute("reservaData",new ReservaData());
        model.addAttribute("valorarData",new ValorarData());
        Collections.sort(rutinas, Comparator.comparing(Rutina::getPuntos).reversed());
        model.addAttribute("mejores",rutinas.stream().limit(5).collect(Collectors.toList()));
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
    @GetMapping("/rutinasMovil")
    @ResponseBody
    public List<Rutina> rutinasMovil(Model model){
        List<Rutina> rutinas = actividadService.findAllRutinas();
        return rutinas;
    }
    @GetMapping("/rutinasDestacadasMovil")
    @ResponseBody
    public List<Rutina> rutinasDestacadasMovil(Model model){
        List<Rutina> rutinas = actividadService.findAllRutinas();
        Collections.sort(rutinas, Comparator.comparing(Rutina::getPuntos).reversed());
        model.addAttribute("mejores",rutinas.stream().limit(5).collect(Collectors.toList()));
        return rutinas;
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
        if(actividadData.getMaquina()==null){
            a.setMaquina(null);
        }else{
            a.setMaquina(actividadData.getMaquina());
        }
        a.setZonaCuerpo(actividadData.getZonaCuerpo());
        actividadService.registrar(a);
        return "redirect:/actividades";
    }
    @PostMapping("/rutinas")
    public String nuevaRutina(RutinaData rutinaData, BindingResult result){
        if (result.hasErrors()) {
            return "actividad";
        }
        Rutina r = new Rutina();
        r.setNombre(rutinaData.getNombre());
        r.setActividades(rutinaData.getActividades());
        actividadService.registrar(r);
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
        r.setRutina(reservaData.getIdRutina());
        r.setEstado(Estado.Pendiente);
        r.setValorada(false);
        actividadService.registrar(r);
        return "redirect:/actividades";
    }
    @PostMapping("/reservarMovil")
    @ResponseBody
    public ResponseEntity<Object> reservarMovil(@Valid@RequestBody ReservaBody reservaBody) throws ParseException {
        Long id = managerUserSession.usuarioLogeado();
        Usuario u = usuarioService.findById(id);
        String dateString = reservaBody.getFecha();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date date = dateFormat.parse(dateString);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        Usuario m = usuarioService.findById(reservaBody.getIdMonitor());
        Rutina a = actividadService.findRutinaById(reservaBody.getIdRutina());
        Reservation r = new Reservation();
        r.setTitle(reservaBody.getTitle());
        r.setCliente(u);
        r.setStart(calendar);
        r.setMonitor(m);
        r.setRutina(a);
        r.setEstado(Estado.Pendiente);
        r.setValorada(false);
        actividadService.registrar(r);
        ApiResponse response = new ApiResponse("Reserva realizada corrrectamente");
        return ResponseEntity.ok().body(response);
    }
    @PostMapping("/reservar/finalizar/{id}")
    public String finalizar(@PathVariable(value="id") Long idReserva){
        Reservation r = actividadService.finalizarReserva(idReserva);
        usuarioService.subirPuntos(r);
        return "redirect:/actividades";
    }
    @PostMapping("/valorar/{idR}/{idA}")
    public String valorar(@Valid ValorarData valorarData,@PathVariable(value="idR") Long idReserva,@PathVariable(value="idA") Long idRutina){
        actividadService.valorar(idRutina,valorarData.getPuntos(),idReserva);
        return "redirect:/actividades";
    }
    @PostMapping("/valorarMovil/{idR}/{idA}")
    @ResponseBody
    public ResponseEntity<Object> valorarMovil(@Valid@RequestBody ValorarData valorarData,@PathVariable(value="idR") Long idReserva,@PathVariable(value="idA") Long idRutina){
        actividadService.valorar(idRutina,valorarData.getPuntos(),idReserva);
        return ResponseEntity.ok().body("OK");
    }
    @GetMapping("/reservas")
    @ResponseBody
    public List<Reservation>reservas(){
        Usuario u = usuarioService.findById(managerUserSession.usuarioLogeado());
        List<Reservation>reservas = actividadService.findActividades(u);
        return reservas;
    }
    @PostMapping("/actividades/eliminar")
    public String EliminarActividad(ActividadData actividadData, RedirectAttributes flash){
        Actividad a = actividadService.findById(actividadData.getId());
        try{
            actividadService.eliminarActividad(a);
        } catch(Exception e){
            flash.addFlashAttribute("errorActividad","No se ha podido borrar porque esta asociada a una rutina");
        }
        return "redirect:/actividades";
    }
    @PostMapping("/rutinas/eliminar")
    public String EliminarRutina(RutinaData rutinaData, RedirectAttributes flash){
        Rutina r = actividadService.findRutinaById(rutinaData.getId());
        try{
            actividadService.eliminarRutina(r);
        } catch(Exception e){
            flash.addFlashAttribute("errorActividad","No se ha podido borrar porque hay una reserva Asociada");
        }
        return "redirect:/actividades";
    }
}
