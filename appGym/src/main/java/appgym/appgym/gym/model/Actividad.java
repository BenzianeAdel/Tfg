package appgym.appgym.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "actividades")
public class Actividad {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;
    private ZonaCuerpo zonaCuerpo;
    private int repeticiones;
    private int series;
    private int puntos;

    @OneToOne
    @JoinColumn(name = "maquina_id")
    private Maquina maquina;

    @OneToOne
    @JoinColumn(name = "creador_id")
    private Usuario creador;

    @OneToMany(mappedBy = "actividad", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    List<Multimedia> multimedia = new ArrayList<>();

}
