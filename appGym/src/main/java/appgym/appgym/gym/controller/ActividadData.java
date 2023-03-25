package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.ZonaCuerpo;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.Multipart;

public class ActividadData {
    private Long id;
    private String nombre;
    private ZonaCuerpo zonaCuerpo;
    private int series;
    private int repeticiones;
    private Maquina maquina;
    private MultipartFile imagen;

    public Long getId(){
        return id;
    }
    public void setId(Long i){
        this.id=i;
    }

    public void setNombre(String n){
        this.nombre= n;
    }
    public void setZonaCuerpo(ZonaCuerpo z){
        this.zonaCuerpo = z;
    }
    public void setRepeticiones(int r){
        this.repeticiones = r;
    }
    public void setSeries(int s){
        this.series = s;
    }
    public String getNombre(){
        return nombre;
    }
    public int getSeries(){
        return series;
    }
    public int getRepeticiones(){
        return repeticiones;
    }

    public ZonaCuerpo getZonaCuerpo() {
        return zonaCuerpo;
    }
    public Maquina getMaquina(){return maquina;}
    public void setMaquina(Maquina m){
        this.maquina = m;
    }

    public void setImagen(MultipartFile i){
        this.imagen = i;
    }
    public MultipartFile getImagen(){
        return imagen;
    }
}
