package appgym.appgym.gym.controller;

public class ContactoData {
    private String email;
    private String nombre;

    private String asunto;

    private String mensaje;

    public String getEmail() {
        return email;
    }

    public void setEmail(String eMail) {
        this.email = eMail;
    }

    public String getNombre(){return nombre;}

    public void setNombre(String n){this.nombre=n;}

    public String getAsunto(){return asunto;}
    public void setAsunto(String a){this.asunto = a;}
    public String getMensaje(){return mensaje;}
    public void setMensaje(String m){this.mensaje = m;}


}
