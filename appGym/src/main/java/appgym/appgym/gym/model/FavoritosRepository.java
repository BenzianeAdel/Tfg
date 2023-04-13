package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FavoritosRepository extends CrudRepository<Favoritos, Long> {
    @Query("select e from Favoritos e where e.usuario.id= ?1")
    public Favoritos getFavoritosBy(Long idy);
}
