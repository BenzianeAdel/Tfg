package appgym.appgym.gym.service;

import appgym.appgym.gym.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class ActividadService {
    @Autowired
    private ActividadRepository actividadRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RutinaRepository rutinaRepository;

    @Autowired
    private MultimediaRepository multimediaRepository;
    @Autowired
    private FavoritosRepository favoritosRepository;

    @Transactional(readOnly = true)
    public Actividad findById(Long actividadId) {
        return actividadRepository.findById(actividadId).orElse(null);
    }
    @Transactional(readOnly = true)
    public Reservation findReservaById(Long reservaID) {
        return reservationRepository.findById(reservaID).orElse(null);
    }
    @Transactional(readOnly = true)
    public Rutina findRutinaById(Long rutinaId) {
        return rutinaRepository.findById(rutinaId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Actividad> findAll() {
        return (List<Actividad>) actividadRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public List<Reservation> findAllReservas() {
        return (List<Reservation>) reservationRepository.findAllByOrderByIdDesc();
    }
    @Transactional(readOnly = true)
    public List<Multimedia> findAllImagenes() {
        return (List<Multimedia>) multimediaRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public List<Rutina> findAllRutinas() {
        return (List<Rutina>) rutinaRepository.findAllByOrderByIdDesc();
    }

    public Actividad registrar(Actividad a){
        return actividadRepository.save(a);
    }
    public Reservation registrar(Reservation r){
        return reservationRepository.save(r);
    }
    public Multimedia registrar(Multimedia m){
        return multimediaRepository.save(m);
    }
    public Rutina registrar(Rutina r){
        return rutinaRepository.save(r);
    }
    @Transactional(readOnly = true)
    public List<Reservation> findActividades(Usuario u) {
        List<Reservation> reservas = findAllReservas();
        List<Reservation> reser = new ArrayList<>();
        for (int i = 0; i < reservas.size(); i++) {
                if (u.getTipoUser()==User.cliente) {
                    if(reservas.get(i).getCliente().getId() == u.getId()){
                        reser.add(reservas.get(i));
                    }
                }else{
                    if (u.getTipoUser()==User.monitor) {
                        if(reservas.get(i).getMonitor().getId() == u.getId()){
                            reser.add(reservas.get(i));
                        }
                    }
                }
        }
        return reser;
    }
    @Transactional(readOnly = false)
    public Reservation finalizarReserva(Long idR){
        Reservation r = findReservaById(idR);
        r.setEstado(Estado.Finalizada);
        reservationRepository.save(r);
        return r;
    }
    @Transactional(readOnly = false)
    public List<Reservation>findFranjas(Usuario monitor, Calendar f){
        List<Reservation>reservas=new ArrayList<>();
        for(int i=0;i<findAllReservas().size();i++){
            if(findAllReservas().get(i).getMonitor().getId()==monitor.getId() && (findAllReservas().get(i).getStart().get(Calendar.YEAR) == f.get(Calendar.YEAR) &&
                    findAllReservas().get(i).getStart().get(Calendar.MONTH) == f.get(Calendar.MONTH) &&
                    findAllReservas().get(i).getStart().get(Calendar.DAY_OF_MONTH) == f.get(Calendar.DAY_OF_MONTH))){
                reservas.add(findAllReservas().get(i));
            }
        }
        return reservas;
    }
    @Transactional(readOnly = false)
    public void valorar(Long ida,int p,Long idR){
        Rutina a = findRutinaById(ida);
        Reservation r = findReservaById(idR);
        r.setValorada(true);
        reservationRepository.save(r);
        a.setPuntos(a.getPuntos()+p);
        rutinaRepository.save(a);
    }
    @Transactional(readOnly = false)
    public void eliminarActividad(Actividad a){
        actividadRepository.delete(a);
    }
    @Transactional(readOnly = false)
    public void eliminarRutina(Rutina r){
        rutinaRepository.delete(r);
    }

    @Transactional(readOnly = false)
    public void anadirFavoritos(Long idR,Usuario u){
        Favoritos f = favoritosRepository.getFavoritosBy(u.getId());
        if(f == null){
            f = new Favoritos();
            f.setUsuario(u);
        }
        Rutina r = findRutinaById(idR);
        f.getRutinas().add(r);
        favoritosRepository.save(f);
    }
    @Transactional(readOnly = false)
    public void eliminarDeFavoritos(Long idR,Usuario u){
        Favoritos f = favoritosRepository.getFavoritosBy(u.getId());
        Rutina r = findRutinaById(idR);
        f.getRutinas().remove(r);
        favoritosRepository.save(f);
    }
    @Transactional(readOnly = true)
    public boolean busquedaRutinaDentroFavoritos(Long idR,Long idU){
        boolean esta=false;
        Favoritos f = favoritosRepository.getFavoritosBy(idU);
        if(f!=null){
            for(int i=0;i<f.getRutinas().size() && esta==false;i++){
                if(f.getRutinas().get(i).getId() == idR){
                    esta=true;
                }
            }
        }
        return esta;
    }
    @Transactional(readOnly = true)
    public Favoritos getFavoritosUser(Long idU){
        Favoritos f = favoritosRepository.getFavoritosBy(idU);
        if(f == null){
            f = new Favoritos();
        }
        return f;
    }
}
