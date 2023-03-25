package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Actividad;

import java.util.List;
import java.util.Set;

public class RutinaData {

    private Long id;
    private String nombre;
    private Set<Actividad> actividades;

    public Long getId(){return id;}
    public void setId(Long i){this.id=i;}
    public void setNombre(String n){
        this.nombre= n;
    }
    public String getNombre(){
        return nombre;
    }

    public Set<Actividad> getActividades(){
        return actividades;
    }

    public void setActividades(Set<Actividad> actividades) {
        this.actividades = actividades;
    }
}
