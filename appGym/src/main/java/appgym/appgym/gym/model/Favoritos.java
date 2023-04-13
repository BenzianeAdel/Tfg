package appgym.appgym.gym.model;

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
@Table(name = "favoritos")
public class Favoritos {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "favoritos_rutinas",
            joinColumns = { @JoinColumn(name = "fk_favoritos") },
            inverseJoinColumns = {@JoinColumn(name = "fk_rutinas")}
    )
    List<Rutina> rutinas = new ArrayList<>();
}
