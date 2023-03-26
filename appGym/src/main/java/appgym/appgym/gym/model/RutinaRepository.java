package appgym.appgym.gym.model;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RutinaRepository extends CrudRepository<Rutina, Long> {
    List<Rutina> findAllByOrderByIdDesc();
}
