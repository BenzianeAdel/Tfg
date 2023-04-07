package appgym.appgym.gym.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "mensajes")
public class Mensajes {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String texto;

    @OneToOne
    @JoinColumn(name = "emisor_id")
    private Usuario emisor;
    @OneToOne
    @JoinColumn(name = "receptor_id")
    private Usuario receptor;
    @Column(name = "fecha")
    private LocalDateTime fecha;
}
