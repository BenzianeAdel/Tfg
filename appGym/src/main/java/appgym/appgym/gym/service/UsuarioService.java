package appgym.appgym.gym.service;


import appgym.appgym.gym.authentication.HashUtils;
import appgym.appgym.gym.controller.ContactoData;
import appgym.appgym.gym.model.*;
import appgym.appgym.gym.service.exception.UsuarioServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
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
    @Autowired
    private EnfermedadRepository enfermedadRepository;

    @Autowired
    private JavaMailSender correo;

    @Transactional(readOnly = true)
    public LoginStatus login(String eMail, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(eMail);
        if (!usuario.isPresent()) {
            return LoginStatus.USER_NOT_FOUND;
        } else if (!usuario.get().getPassword().equals(HashUtils.hashPassword(password))) {
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
        usuario.setPassword(HashUtils.hashPassword(usuario.getPassword()));
        if (usuarioBD.isPresent())
            throw new UsuarioServiceException("El usuario " + usuario.getEmail() + " ya está registrado");
        else if (usuario.getEmail() == null)
            throw new UsuarioServiceException("El usuario no tiene email");
        else if (usuario.getPassword() == null)
            throw new UsuarioServiceException("El usuario no tiene password");
        else return usuarioRepository.save(usuario);
    }
    @Transactional
    public void registrar(Enfermedades enfermedades){
        enfermedadRepository.save(enfermedades);
    }
    @Transactional
    public void editarUsuario(Usuario u){
        usuarioRepository.save(u);
    }
    @Transactional
    public void eliminarUsuario(Usuario u){
        usuarioRepository.delete(u);
    }
    @Transactional
    public void eliminarEnfermedad(Enfermedades e){
        enfermedadRepository.delete(e);
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
    public Enfermedades findByIdEnfermedad(Long enfermedadID) {
        return enfermedadRepository.findById(enfermedadID).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return (List<Usuario>) usuarioRepository.findAllByOrderByIdDesc();
    }
    @Transactional(readOnly = true)
    public List<Seguir> findAllSeguir() {
        return (List<Seguir>) seguirRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Usuario> findAllTip(String busca,User usuario,Long idY) {
        List<Usuario> usuarios = findAll();
        List<Usuario> users = new ArrayList<>();
        if(busca != null && busca != ""){
                users = usuarioRepository.busquedaUsuario(busca, usuario);
        }
        else{
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
        }
        return users;
    }
    @Transactional(readOnly = true)
    public List<Mensajes> findAllMensajes() {
        return (List<Mensajes>) mensajesRepository.findAll();
    }
    @Transactional(readOnly = true)
    public List<Usuario> findContactos(Long idY,String busca) {
        //List<Usuario> usuarios = findAll();
        List<Mensajes> mensajes = findAllMensajes();
        List<Usuario> users = new ArrayList<>();
        List<Usuario> usuarios = null;
        if(busca == null){
            for(int k=mensajes.size()-1;k>=0;k--){
                if(mensajes.get(k).getReceptor().getId()==idY && !users.contains(mensajes.get(k).getEmisor())){
                    users.add(mensajes.get(k).getEmisor());
                } else{
                    if(mensajes.get(k).getEmisor().getId()==idY && !users.contains(mensajes.get(k).getReceptor())){
                        users.add(mensajes.get(k).getReceptor());
                    }
                }
            }
            usuarios = new ArrayList<Usuario>(users);
        }
        else{
            usuarios = usuarioRepository.busquedaContacto(busca);
        }
        return usuarios;
    }
    @Transactional(readOnly = true)
    public List<Usuario> usersMessages(Long idY) {
        List<Usuario> usuarios = findAll();
        List<Usuario> users = new ArrayList<>();
            for (int i = 0; i < usuarios.size(); i++) {
                if(idY == null){
                    if (usuarios.get(i).getTipoUser() != User.admin) {
                        users.add(usuarios.get(i));
                    }
                }else{
                    if (usuarios.get(i).getTipoUser() != User.admin && usuarios.get(i).getId() != idY) {
                        users.add(usuarios.get(i));
                    }
                }
            }
        return users;
    }
    @Transactional(readOnly = true)
    public List<Usuario> buscador(String busca,User tipo,Long idY){
        if(busca != null){
            return usuarioRepository.busqueda(busca,idY);
        }
        return findAllTip(null,tipo,idY);
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
        usuarioRepository.eliminarEntidadRelacionadaFavoritos(u);
    }
    @Transactional(readOnly = false)
    public void eliminarRelacionesMonitor(Usuario u){
        usuarioRepository.eliminarEntidadRelacionadaReservaPorMonitor(u);
        usuarioRepository.eliminarEntidadRelacionadaMensajes(u);
    }

    public void sendVerificationEmail(Usuario user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "adelbenziane17@gmail.com";
        String senderName = "ADUAFitness";
        String subject = "Verificacion de la cuenta";
        String content = "Estimado [[name]],<br>"
                + "Porfavor dale al enlace inferior para verificar su registro:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFICAR</a></h3>"
                + "Muchas gracias,<br>"
                + "ADUAFitness.";

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
        String servletPath = request.getServletPath();
        String contextPath = request.getContextPath();
        String serverName = request.getLocalAddr();
        int serverPort = request.getServerPort();
        String url = siteURL.replace(servletPath, "").replace(contextPath, "");
        return url.startsWith("http") ? url : String.format("%s://%s:%d%s", request.getScheme(), serverName, serverPort, url);
    }
    public boolean verify(String verificationCode) {
        Usuario user = usuarioRepository.findByVerificationCode(verificationCode);

        if (user == null || user.isEnabled()) {
            return false;
        } else {
            user.setVerificationCode(null);
            user.setEnabled(true);
            usuarioRepository.save(user);
            return true;
        }
    }
    @Transactional(readOnly = true)
    public void sendRessetEmail(Usuario user, String siteURL) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "adelbenziane17@gmail.com";
        String senderName = "ADUAFitness";
        String subject = "Restablecer la contraseña";
        String content = "Estimado [[name]],<br>"
                + "Porfavor dale al enlace inferior para cambiar la contraseña:<br>"
                + "<h3><a href=\"[[URL]]\" target=\"_self\">RESTABLECER</a></h3>"
                + "Muchas gracias,<br>"
                + "ADUAFitness.";

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
    public void resetPassword(Long iduser, String pass) {
        Usuario usuario = usuarioRepository.findById(iduser).orElse(null);

        if (usuario != null) {
            usuario.setPassword(HashUtils.hashPassword(pass));
            usuarioRepository.save(usuario);
        } else {
            throw new UsuarioServiceException("Usuario erroneo, no se puede modificar...");
        }
    }
    @Transactional(readOnly = true)
    public void sendContacto(ContactoData contactoData) throws MessagingException, UnsupportedEncodingException {
        String fromAddress = contactoData.getEmail();
        String toAddress = "adelbenziane17@gmail.com";
        String senderName = contactoData.getNombre() + " con email: " + contactoData.getEmail();
        String subject = contactoData.getAsunto();
        String content = contactoData.getMensaje();

        MimeMessage message = correo.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        helper.setText(content, true);
        correo.send(message);
    }
}
