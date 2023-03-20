package appgym.appgym.gym.service;

import appgym.appgym.gym.model.MaquinaRepository;
import appgym.appgym.gym.model.Mensajes;
import appgym.appgym.gym.model.MensajesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MensajesService {

    @Autowired
    private MensajesRepository mensajesRepository;
    @Transactional(readOnly = true)
    public List<Mensajes> findAll() {
        return (List<Mensajes>) mensajesRepository.findAll();
    }
    public void registrar(Mensajes m){
        mensajesRepository.save(m);
    }
}
