package appgym.appgym.gym.service;

import appgym.appgym.gym.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadService {
    @Autowired
    private ActividadRepository actividadRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RutinaRepository rutinaRepository;

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
    public List<Rutina> findAllRutinas() {
        return (List<Rutina>) rutinaRepository.findAllByOrderByIdDesc();
    }

    public Actividad registrar(Actividad a){
        return actividadRepository.save(a);
    }
    public Reservation registrar(Reservation r){
        return reservationRepository.save(r);
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
}
