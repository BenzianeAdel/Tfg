package appgym.appgym.gym.model;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaquinaRepository extends CrudRepository<Maquina, Long>{
    @Modifying
    @Query("DELETE FROM Actividad er WHERE er.maquina = :maquina")
    void eliminarEntidadRelacionadaActividadPorMaquina(@Param("maquina") Maquina maquina);
    List<Maquina> findAllByOrderByIdDesc();

    @Query("select e from Maquina e where" +
            " CONCAT(e.id,e.nombre) "
            + "like %?1%")
    public List<Maquina> busquedaMaquina(String busca);
}
