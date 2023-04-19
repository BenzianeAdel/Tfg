package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.ZonaCuerpo;

public class EnfermedadData {
    private Long id;
    private String lesion;
    private ZonaCuerpo zonaEvitar;

    public Long getId() {
        return id;
    }
    public String getLesion(){
        return lesion;
    }
    public ZonaCuerpo getZonaEvitar(){
        return zonaEvitar;
    }
    public void setLesion(String l){
        this.lesion = l;
    }
    public void setZonaEvitar(ZonaCuerpo z){
        this.zonaEvitar = z;
    }
}
