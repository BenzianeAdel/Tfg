package appgym.appgym.gym.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "maquinas")
public class Maquina implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String nombre;

    private String imagen;

    @Column(name = "fecha_registro")
    @Temporal(TemporalType.DATE)
    private Date registro;

}
