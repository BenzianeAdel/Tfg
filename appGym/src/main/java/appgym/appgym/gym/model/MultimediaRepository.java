package appgym.appgym.gym.model;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MultimediaRepository extends CrudRepository<Multimedia, Long> {
    List<Multimedia> findAllByOrderByIdDesc();
}
