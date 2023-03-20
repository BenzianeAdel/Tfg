package appgym.appgym.gym.service;

import appgym.appgym.gym.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActividadService {
    @Autowired
    private ActividadRepository actividadRepository;
    @Autowired
    private ReservationRepository reservationRepository;

    @Transactional(readOnly = true)
    public Actividad findById(Long actividadId) {
        return actividadRepository.findById(actividadId).orElse(null);
    }
    @Transactional(readOnly = true)
    public Reservation findReservaById(Long reservaID) {
        return reservationRepository.findById(reservaID).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Actividad> findAll() {
        return (List<Actividad>) actividadRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Reservation> findAllReservas() {
        return (List<Reservation>) reservationRepository.findAll();
    }

    public Actividad registrar(Actividad a){
        return actividadRepository.save(a);
    }
    public Reservation registrar(Reservation r){
        return reservationRepository.save(r);
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
        Actividad a = findById(ida);
        Reservation r = findReservaById(idR);
        r.setValorada(true);
        reservationRepository.save(r);
        a.setPuntos(a.getPuntos()+p);
        actividadRepository.save(a);
    }
}
