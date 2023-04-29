package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActividadRepository extends CrudRepository<Actividad, Long> {
    @Modifying
    @Query("DELETE FROM Reservation er WHERE er.rutina = :rutina")
    void eliminarEntidadRelacionadaReservaPorActividad(@Param("rutina") Rutina rutina);
    List<Actividad> findAllByOrderByIdDesc();

    @Query("select e from Actividad e where" +
            " CONCAT(e.id,e.nombre,e.creador.nombre,e.creador.email) "
            + "like %?1%")
    public List<Actividad> busquedaActividad(String busca);
}
