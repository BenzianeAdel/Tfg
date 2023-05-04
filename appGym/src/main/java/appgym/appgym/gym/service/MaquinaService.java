package appgym.appgym.gym.service;

import appgym.appgym.gym.model.Actividad;
import appgym.appgym.gym.model.ActividadRepository;
import appgym.appgym.gym.model.Maquina;
import appgym.appgym.gym.model.MaquinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

@Service
public class MaquinaService {
    @Autowired
    private MaquinaRepository maquinaRepository;
    @Autowired
    private ActividadRepository actividadRepository;
    @Transactional(readOnly = true)
    public Maquina findById(Long maquinaId) {
        return maquinaRepository.findById(maquinaId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Maquina> findAll() {
        return (List<Maquina>) maquinaRepository.findAllByOrderByIdDesc();
    }

    @Transactional(readOnly = true)
    public List<Actividad> findAllActividades() {
        return (List<Actividad>) actividadRepository.findAllByOrderByIdDesc();
    }

    public Maquina registrar(Maquina a){
        return maquinaRepository.save(a);
    }
    public void editarMaquina(Maquina a){
         maquinaRepository.save(a);
    }

    @Transactional(readOnly = false)
    public void eliminarMaquina(Maquina a){
        List<Actividad> actividades = findAllActividades();
        for(int i=0;i<actividades.size();i++){
            if(actividades.get(i).getMaquina()==a){
                actividades.get(i).setMaquina(null);
                actividadRepository.save(actividades.get(i));
            }
        }
        String carpetaImagenes = "src/main/resources/static/img/maquinas/" + a.getId();
        Path pathCarpeta = Paths.get(carpetaImagenes);
        File carpeta = new File(carpetaImagenes);
        if(carpeta.exists() && carpeta.isDirectory()){
            try {
                Files.walk(pathCarpeta)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        maquinaRepository.delete(a);
    }
    @Transactional(readOnly = true)
    public List<Maquina> busquedaMaquina(String busca) {
        if(busca != null){
            return maquinaRepository.busquedaMaquina(busca);
        }
        return findAll();
    }
}
