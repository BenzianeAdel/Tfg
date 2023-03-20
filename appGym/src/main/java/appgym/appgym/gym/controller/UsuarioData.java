package appgym.appgym.gym.controller;

import appgym.appgym.gym.model.User;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.Date;

public class UsuarioData {
    private Long id;
    @Email
    private String eMail;

    @NotNull
    private String password;
    @NotNull
    private String apellidos;
    @NotNull
    private String nombre;

    @DateTimeFormat(pattern = "MM/dd/yyyy")
    private Date fechaNacimiento;

    private User user;
    private boolean acceso = true;

    public String geteMail() {
        return eMail;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public User getUser(){
        return user;
    }
    public void setUser(User u){
        this.user = u;
    }
    public boolean getAcceso(){return acceso;}
    public void setAcceso(boolean a){
        this.acceso = a;
    }
    public Long getId(){return id;}
    public void setId(Long i){
        this.id = i;
    }
}
