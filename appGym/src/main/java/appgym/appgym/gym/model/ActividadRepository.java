package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ActividadRepository extends CrudRepository<Actividad, Long> {
    @Modifying
    @Query("DELETE FROM Reservation er WHERE er.rutina = :rutina")
    void eliminarEntidadRelacionadaReservaPorActividad(@Param("rutina") Rutina rutina);
}
