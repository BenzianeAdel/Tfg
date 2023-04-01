package appgym.appgym.gym.model;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String s);
    @Query("select e from Usuario e where" +
            " CONCAT(e.id,e.nombre,e.apellidos,e.email) "
            + "like %?1%" + "and e.tipoUser=1" + "and e.id != ?2")
    public List<Usuario> busqueda(String busca,Long idY);

    @Query("select e from Usuario e where" +
            " CONCAT(e.id,e.nombre,e.apellidos,e.email) "
            + "like %?1%" + "and e.tipoUser!=0")
    public List<Usuario> busquedaContacto(String busca);
    @Modifying
    @Query("DELETE FROM Reservation er WHERE er.monitor = :usuario")
    void eliminarEntidadRelacionadaReservaPorMonitor(@Param("usuario") Usuario usuario);
    @Modifying
    @Query("DELETE FROM Reservation er WHERE er.cliente = :usuario")
    void eliminarEntidadRelacionadaReservaPorCliente(@Param("usuario") Usuario usuario);
    @Modifying
    @Query("DELETE FROM Seguir er WHERE er.seguido = :usuario or er.seguidor = :usuario")
    void eliminarEntidadRelacionadaSeguirPorCliente(@Param("usuario") Usuario usuario);
    @Modifying
    @Query("DELETE FROM Mensajes er WHERE er.emisor = :usuario or er.receptor = :usuario")
    void eliminarEntidadRelacionadaMensajes(@Param("usuario") Usuario usuario);

    @Query("SELECT u FROM Usuario u WHERE u.verificationCode = ?1")
    public Usuario findByVerificationCode(String code);
}
