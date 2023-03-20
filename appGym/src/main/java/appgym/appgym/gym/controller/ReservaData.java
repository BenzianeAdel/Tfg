package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.Usuario;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

public class ReservaData {
    private String title;
    private Usuario idMonitor;
    private Actividad idActividad;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
    private Calendar fecha;

    public String getTitle(){
        return title;
    }
    public Usuario getIdMonitor(){
        return idMonitor;
    }
    public Calendar getFecha(){
        return fecha;
    }
    public Actividad getIdActividad(){
        return idActividad;
    }
    public void setTitle(String t){
        this.title = t;
    }
    public void setIdMonitor(Usuario m){
        this.idMonitor = m;
    }
    public void setIdActividad(Actividad a){
        this.idActividad = a;
    }
    public void setFecha(Calendar f){
        this.fecha = f;
    }
}
