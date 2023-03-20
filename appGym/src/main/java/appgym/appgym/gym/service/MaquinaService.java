package appgym.appgym.gym.service;

import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.MaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MaquinaService {
    @Autowired
    private MaquinaRepository maquinaRepository;
    @Transactional(readOnly = true)
    public Maquina findById(Long maquinaId) {
        return maquinaRepository.findById(maquinaId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Maquina> findAll() {
        return (List<Maquina>) maquinaRepository.findAll();
    }

}
