package appgym.appgym.gym.service;

import appgym.appgym.gym.model.MaquinaRepository;
import appgym.appgym.gym.model.Mensajes;
import appgym.appgym.gym.model.MensajesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    public List<Mensajes>getMensajesPorUsuario(Long usuarioId,Long miId){
        List<Mensajes>m = findAll();
        List<Mensajes>me = new ArrayList<>();
        for(int i=0;i<m.size();i++){
            if((m.get(i).getReceptor().getId()==usuarioId && m.get(i).getEmisor().getId()==miId) || (m.get(i).getEmisor().getId()==usuarioId && m.get(i).getReceptor().getId()==miId)){
                me.add(m.get(i));
            }
        }
        return me;
    }
}
