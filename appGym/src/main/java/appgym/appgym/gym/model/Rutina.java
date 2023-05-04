package appgym.appgym.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Getter
@Setter
@Entity
@Table(name = "rutinas")
public class Rutina {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    private int puntos;

    @OneToOne
    @JoinColumn(name = "creador_id")
    private Usuario creador;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rutina_actividad",
            joinColumns = { @JoinColumn(name = "fk_rutina") },
            inverseJoinColumns = {@JoinColumn(name = "fk_actividad")}
    )
    List<Actividad> actividades = new ArrayList<>();
}
