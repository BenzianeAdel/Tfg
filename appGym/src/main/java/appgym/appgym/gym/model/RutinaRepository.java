package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RutinaRepository extends CrudRepository<Rutina, Long> {
    List<Rutina> findAllByOrderByIdDesc();

    @Query("select e from Rutina e where" +
            " CONCAT(e.id,e.nombre,e.puntos,e.creador.nombre,e.creador.email) "
            + "like %?1%")
    public List<Rutina> busquedaRutina(String busca);
}
