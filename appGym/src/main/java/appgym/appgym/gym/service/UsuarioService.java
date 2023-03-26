package appgym.appgym.gym.service;


import appgym.appgym.gym.model.*;
import appgym.appgym.gym.service.exception.UsuarioServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class UsuarioService {

    Logger logger = LoggerFactory.getLogger(UsuarioService.class);



    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private UsuarioSeguirRepository seguirRepository;

    @Autowired
    private MensajesRepository mensajesRepository;

    //@Autowired
    //private JavaMailSender correo;

    @Transactional(readOnly = true)
    public LoginStatus login(String eMail, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(eMail);
        if (!usuario.isPresent()) {
            return LoginStatus.USER_NOT_FOUND;
        } else if (!usuario.get().getPassword().equals(password)) {
            return LoginStatus.ERROR_PASSWORD;
        } else if (usuario.get().isAcceso() == false) {
            return LoginStatus.ERROR_BLOQUEADO;
        } else if (usuario.get().isEnabled()== false) {
            return LoginStatus.CUENTA_DESACTIVADA;
        } else {
            return LoginStatus.LOGIN_OK;
        }
    }
    @Transactional
    public Usuario registrar(Usuario usuario) {
        Optional<Usuario> usuarioBD = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioBD.isPresent())
            throw new UsuarioServiceException("El usuario " + usuario.getEmail() + " ya está registrado");
        else if (usuario.getEmail() == null)
            throw new UsuarioServiceException("El usuario no tiene email");
        else if (usuario.getPassword() == null)
            throw new UsuarioServiceException("El usuario no tiene password");
        else return usuarioRepository.save(usuario);
    }
    @Transactional
    public void editarUsuario(Usuario u){
        usuarioRepository.save(u);
    }
    @Transactional
    public void eliminarUsuario(Usuario u){
        usuarioRepository.delete(u);
    }
    @Transactional(readOnly = true)
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    @Transactional(readOnly = true)
    public Usuario findById(Long usuarioId) {
        return usuarioRepository.findById(usuarioId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return (List<Usuario>) usuarioRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Seguir> findAllSeguir() {
        return (List<Seguir>) seguirRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Usuario> findAllTip(User usuario,Long idY) {
        List<Usuario> usuarios = findAll();
        List<Usuario> users = new ArrayList<>();
        for (int i = 0; i < usuarios.size(); i++) {
            if(idY == null){
                if (usuarios.get(i).getTipoUser() == usuario) {
                    users.add(usuarios.get(i));
                }
            }else{
                if (usuarios.get(i).getTipoUser() == usuario && usuarios.get(i).getId()!=idY) {
                    users.add(usuarios.get(i));
                }
            }
        }
        return users;
    }
    @Transactional(readOnly = true)
    public List<Mensajes> findAllMensajes() {
        return (List<Mensajes>) mensajesRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Usuario> findContactos(Long idY,String busca) {
        List<Usuario> usuarios = findAll();
        List<Mensajes> mensajes = findAllMensajes();
        List<Usuario> users = new ArrayList<>();
        if(busca == null){
            for (int i = 0; i < usuarios.size(); i++) {
                if(idY == null){
                    if (usuarios.get(i).getTipoUser() != User.admin) {
                        users.add(usuarios.get(i));
                    }
                }else{
                    if (usuarios.get(i).getTipoUser() != User.admin) {
                        for(int j=0;j<mensajes.size();j++){
                            if((mensajes.get(j).getReceptor().getId()==usuarios.get(i).getId() && mensajes.get(j).getEmisor().getId()==idY) || (mensajes.get(j).getEmisor().getId()==usuarios.get(i).getId() && mensajes.get(j).getReceptor().getId()==idY)){
                                users.add(usuarios.get(i));
                            }
                        }
                    }
                }
            }
        }
        else{
            users = usuarioRepository.busquedaContacto(busca);
        }
        return users;
    }
    @Transactional(readOnly = true)
    public List<Usuario> buscador(String busca,User tipo,Long idY){
        if(busca != null){
            return usuarioRepository.busqueda(busca,idY);
        }
        return findAllTip(tipo,idY);
    }
    @Transactional(readOnly = true)
    public List<Usuario> misamigos(List<Usuario>usuarios,Long idY){
        List<Usuario> users = new ArrayList<>();
        List<Seguir>seguir = findAllSeguir();

        for (int i = 0; i < usuarios.size(); i++) {
            for(int j = 0;j < seguir.size(); j++){
                if (usuarios.get(i).getId() == seguir.get(j).getSeguido().getId() && idY == seguir.get(j).getSeguidor().getId()) {
                    users.add(usuarios.get(i));
                }
            }
        }
        return users;
    }
    @Transactional(readOnly = true)
    public List<Usuario> noamigos(List<Usuario>usuarios,Long idY){
        List<Usuario> amigos = misamigos(usuarios,idY);
        List<Usuario> noamigos = new ArrayList<>();
        boolean esta= false;

        for(int i=0;i<usuarios.size();i++){
            for(int j=0;j<amigos.size();j++){
                if(usuarios.get(i)==amigos.get(j)){
                    esta = true;
                }
            }
            if(esta==false){
                noamigos.add(usuarios.get(i));
            }
            esta = false;
        }
        return noamigos;
    }

    @Transactional(readOnly = false)
    public void seguirAmigo(Long idSeguido,Long idSeguidor){
        Usuario seguido = findById(idSeguido);
        Usuario seguidor = findById(idSeguidor);
        Seguir s = new Seguir();
        s.setSeguidor(seguidor);
        s.setSeguido(seguido);
        seguirRepository.save(s);
    }
    @Transactional(readOnly = false)
    public void dejarAmigo(Long idSeguido,Long idSeguidor){
        seguirRepository.eliminarSeguido(idSeguido,idSeguidor);
    }
    @Transactional(readOnly = false)
    public void subirPuntos(Reservation r){
        Usuario u = findById(r.getCliente().getId());
        u.setPuntos(u.getPuntos()+1);
        usuarioRepository.save(u);
    }
    @Transactional(readOnly = false)
    public void eliminarRelacionesCliente(Usuario u){
        usuarioRepository.eliminarEntidadRelacionadaReservaPorCliente(u);
        usuarioRepository.eliminarEntidadRelacionadaSeguirPorCliente(u);
        usuarioRepository.eliminarEntidadRelacionadaMensajes(u);
    }
    @Transactional(readOnly = false)
    public void eliminarRelacionesMonitor(Usuario u){
        usuarioRepository.eliminarEntidadRelacionadaReservaPorMonitor(u);
        usuarioRepository.eliminarEntidadRelacionadaMensajes(u);
    }
    /*
    @Transactional(readOnly = true)
    public List<Usuario> findAllMenosLogueado() {
        List<Usuario> usuarios = findAll();
        List<Usuario> users = new ArrayList<>();
        for (int i = 0; i < usuarios.size(); i++) {
            if (usuarios.get(i).getAdministrador() == false) {
                users.add(usuarios.get(i));
            }
        }
        return users;
    }

    @Transactional(readOnly = true)
    public boolean hayAdministrador() {
        List<Usuario> users = findAll();
        boolean hayadmin = false;
        for (int i = 0; i < users.size() && hayadmin == false; i++) {
            if (users.get(i).getAdministrador() == true) {
                hayadmin = true;
            }
        }
        return hayadmin;
    }

    @Transactional(readOnly = true)
    public Long devolverIDAdministrador() {
        Long id = -1L;
        List<Usuario> users = findAll();
        for (int i = 0; i < users.size() && id == -1L; i++) {
            if (users.get(i).getAdministrador() == true) {
                id = users.get(i).getId();
            }
        }
        return id;
    }

    @Transactional(readOnly = true)
    public boolean soyAdministrador(Long id) {
        Usuario user = findById(id);
        return user.getAdministrador();
    }

    @Transactional(readOnly = false)
    public void bloquearUsuario(Long id) {
        Usuario us = findById(id);
        us.setAcceso(false);
    }

    @Transactional(readOnly = false)
    public void habiliarUsuario(Long id) {
        Usuario us = findById(id);
        us.setAcceso(true);
    }

    public void sendVerificationEmail(Usuario user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "adelbenziane17@gmail.com";
        String senderName = "Equipo5 TODOLIST";
        String subject = "Verificacion de la cuenta";
        String content = "Estimado [[name]],<br>"
                + "Porfavor dale al enlace inferior para verificar su registro:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFICAR</a></h3>"
                + "Muchas gracias,<br>"
                + "TODOLIST Equipo5.";

        MimeMessage message = correo.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getNombre());
        String verifyURL = siteURL + "/verify?code=" + user.getVerificationCode();

        content = content.replace("[[URL]]", verifyURL);

        helper.setText(content, true);
        correo.send(message);
    }

    public String getSiteURL(HttpServletRequest request) {
        String siteURL = request.getRequestURL().toString();
        return siteURL.replace(request.getServletPath(), "");
    }

    public boolean verify(String verificationCode) {
        Usuario user = usuarioRepository.findByVerificationCode(verificationCode);

        if (user == null || user.getEnabled()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEnabled(true);
            usuarioRepository.save(user);
            return true;
        }
    }

    @Transactional(readOnly = false)
    public void modificarUsuario(Long idUsuario, Usuario modificar) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElse(null);

        if (usuario != null) {
            usuario.setEmail(modificar.getEmail());
            usuario.setPassword(modificar.getPassword());
            usuario.setNombre(modificar.getNombre());
            usuario.setFechaNacimiento(modificar.getFechaNacimiento());
            usuarioRepository.save(usuario);
        } else {
            throw new UsuarioServiceException("Usuario erroneo, no se puede modificar...");
        }

    }

    @Transactional(readOnly = true)
    public void sendRessetEmail(Usuario user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "adelbenziane17@gmail.com";
        String senderName = "Equipo5 TODOLIST";
        String subject = "Restablecer la contraseña";
        String content = "Estimado [[name]],<br>"
                + "Porfavor dale al enlace inferior para cambiar la contraseña:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">RESTABLECER</a></h3>"
                + "Muchas gracias,<br>"
                + "TODOLIST Equipo5.";

        MimeMessage message = correo.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        content = content.replace("[[name]]", user.getNombre());
        String resetUrl = siteURL + "/ressetPassword/" + user.getId();

        content = content.replace("[[URL]]", resetUrl);

        helper.setText(content, true);
        correo.send(message);
    }

    @Transactional(readOnly = false)
    public void borrarUsuario(Long idUsuarioRegistrado, Long idUsuarioBorrar) {
        if (idUsuarioBorrar != idUsuarioRegistrado) {
            throw new UsuarioServiceException("No se puede borrar un usuario que no sea propio...");
        }
        datosEquipoUsuarioRepository.eliminarRelacionadoUsuario(idUsuarioRegistrado);
        usuarioRepository.deleteById(idUsuarioRegistrado);
    }

    @Transactional(readOnly = false)
    public void resetPassword(Long iduser, String pass) {
        Usuario usuario = usuarioRepository.findById(iduser).orElse(null);

        if (usuario != null) {
            usuario.setPassword(pass);
            usuarioRepository.save(usuario);
        } else {
            throw new UsuarioServiceException("Usuario erroneo, no se puede modificar...");
        }
    }

    @Transactional(readOnly = true)
    public List<Usuario> busquedaUser(String busca) {
        if (busca != null) {
            return usuarioRepository.busqueda(busca);
        }
        return findAll();
    }*/
}
