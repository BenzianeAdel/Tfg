package appgym.appgym.gym.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "actividades")
public class Actividad {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;

    private String imagen;
    private ZonaCuerpo zonaCuerpo;
    private int repeticiones;
    private int series;
    private int puntos;

    @OneToOne
    @JoinColumn(name = "maquina_id")
    private Maquina maquina;

    @ManyToMany(mappedBy = "actividades",fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    Set<Rutina> rutinas = new HashSet<>();
}
