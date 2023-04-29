package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReservationRepository extends CrudRepository<Reservation, Long> {
    List<Reservation> findAllByOrderByIdDesc();

    @Query("select e from Reservation e where" +
            " CONCAT(e.id,e.cliente.nombre,e.cliente.email,e.monitor.email,e.monitor.nombre,e.title) "
            + "like %?1%")
    public List<Reservation> busquedaReserva(String busca);
    @Query("select e from Reservation e where" +
            " CONCAT(e.id,e.cliente.nombre,e.cliente.email,e.monitor.email,e.monitor.nombre,e.title) "
            + "like %?1%" + " and e.cliente.id =?2")
    public List<Reservation> busquedaReservaByUserCliente(String busca,Long idC);

    @Query("select e from Reservation e where" +
            " CONCAT(e.id,e.cliente.nombre,e.cliente.email,e.monitor.email,e.monitor.nombre,e.title) "
            + "like %?1%" + " and e.monitor.id =?2")
    public List<Reservation> busquedaReservaByUserMonitor(String busca,Long idM);
}
