package appgym.appgym.gym.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;
@Getter@Setter
@Entity
@Table(name = "rutinas")
public class Rutina {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    private int puntos;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rutina_actividad",
            joinColumns = { @JoinColumn(name = "fk_rutina") },
            inverseJoinColumns = {@JoinColumn(name = "fk_actividad")}
    )
    Set<Actividad> actividades = new HashSet<>();
}
