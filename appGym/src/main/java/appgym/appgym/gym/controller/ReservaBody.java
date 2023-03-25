package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.Usuario;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Calendar;

public class ReservaBody {
    private String title;
    private Long idMonitor;
    private Long idRutina;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private Calendar fecha;

    public String getTitle(){
        return title;
    }
    public Long getIdMonitor(){
        return idMonitor;
    }
    public Calendar getFecha(){
        return fecha;
    }
    public Long getIdRutina(){
        return idRutina;
    }
    public void setTitle(String t){
        this.title = t;
    }
    public void setIdMonitor(Long m){
        this.idMonitor = m;
    }
    public void setIdRutina(Long a){
        this.idRutina = a;
    }
    public void setFecha(Calendar f){
        this.fecha = f;
    }
}
