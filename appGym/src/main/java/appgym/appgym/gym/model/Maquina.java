package appgym.appgym.gym.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Data
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

    private boolean fueraServicio=false;

    @Column(name = "fecha_registro")
    @Temporal(TemporalType.DATE)
    private Date registro;
    @Column(name = "fecha_ultima_inspeccion")
    @Temporal(TemporalType.DATE)
    private Date ultimaInspeccion;
    @Column(name = "fecha_proxima_inspeccion")
    @Temporal(TemporalType.DATE)
    private Date proximaInspeccion;
}
