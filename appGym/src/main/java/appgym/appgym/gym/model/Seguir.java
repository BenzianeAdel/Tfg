package appgym.appgym.gym.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "usuario_seguir_usuario")
public class Seguir {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "seguido_id")
    private Usuario seguido;
    @OneToOne
    @JoinColumn(name = "seguidor_id")
    private Usuario seguidor;
}
