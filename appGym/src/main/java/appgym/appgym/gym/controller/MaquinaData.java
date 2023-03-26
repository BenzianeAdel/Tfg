package appgym.appgym.gym.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

public class MaquinaData {
    private Long id;
    private String nombre;
    private MultipartFile imagen;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date registro;

    public Long getId(){
        return id;
    }
    public void setId(Long i){
        this.id=i;
    }

    public void setNombre(String n){
        this.nombre= n;
    }
    public String getNombre(){
        return nombre;
    }
    public void setImagen(MultipartFile i){
        this.imagen = i;
    }
    public MultipartFile getImagen(){
        return imagen;
    }

    public Date getRegistro() {
        return registro;
    }

    public void setRegistro(Date regis) {
        this.registro = regis;
    }
}
