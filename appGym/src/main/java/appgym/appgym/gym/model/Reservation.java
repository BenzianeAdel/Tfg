package appgym.appgym.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Calendar;
import java.util.Date;
@Getter
@Setter
@Entity
@Table(name = "reservas")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String title;

    @ManyToOne
    private Usuario monitor;

    @ManyToOne
    private Usuario cliente;

    @ManyToOne
    private Rutina rutina;

    private Calendar start;

    private Estado estado;
    private boolean valorada;

    // constructor, getters y setters
}

