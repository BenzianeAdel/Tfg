package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Actividad;

import java.util.List;

public class RutinaBody {
    private Long id;
    private String nombre;
    private List<Long> actividades;

    public Long getId(){return id;}
    public void setId(Long i){this.id=i;}
    public void setNombre(String n){
        this.nombre= n;
    }
    public String getNombre(){
        return nombre;
    }

    public List<Long> getActividades(){
        return actividades;
    }

    public void setActividades(List<Long> actividades) {
        this.actividades = actividades;
    }
}
