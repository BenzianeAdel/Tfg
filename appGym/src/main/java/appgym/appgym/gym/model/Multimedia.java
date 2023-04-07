package appgym.appgym.gym.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter@Setter
@Entity
@Table(name = "multimedia")
@JsonIgnoreProperties(value = {"actividad"})
public class Multimedia {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actividad_id")
    private Actividad actividad;
}
