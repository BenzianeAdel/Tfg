package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioSeguirRepository extends CrudRepository<Seguir, Long> {
    @Modifying
    @Query("delete from Seguir e where" +
            " e.seguido.id = ?1 and e.seguidor.id= ?2"
    )
    public void eliminarSeguido(Long idSeguido,Long idSeguidor);
}
