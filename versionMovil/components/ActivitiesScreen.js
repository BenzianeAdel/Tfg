import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Card, Button, Icon } from 'react-native-elements';
import IP from '../config';

const ActivitiesScreen = ({ route }) => {
  const { activities } = route.params;
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enfermedades, setEnfermedades] = useState([]);


  useEffect(() => {
    async function fetchEnfermedades() {
      try {
        const response = await fetch(`http://${IP}/enfermedadesMovil`);
        const data = await response.json();
        setEnfermedades(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEnfermedades();
  }, []);

  const handleMachinePress = (machine) => {
    if (machine) {
        setSelectedMaquina(machine);
    }
  };
  const handleActivityPress = (actividad) => {
    if (actividad) {
        setSelectedActivity(actividad);
    }
  };

  const handleModalActividadClose = () => {
    setSelectedActivity(null);
    setCurrentImageIndex(0);
  };
  const handleModalMaquinaClose = () => {
    setSelectedMaquina(null);
  };

  const renderActivity = ({ item }) => {
    const tienePeligro = enfermedades.some((enfermedad) => enfermedad.zonaEvitar === item.zonaCuerpo);
    return (
      <Card>
      <TouchableOpacity
        style={styles.activityContainer}
        onPress={() => handleActivityPress(item)}
      >
        {item.multimedia[0].nombre.endsWith('.jpg') || item.multimedia[0].nombre.endsWith('.png') || item.multimedia[0].nombre.endsWith('.jpeg') || item.multimedia[0].nombre.endsWith('.gif') ? (
                    <Image style={styles.activityImage} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />
                    ) : item.multimedia[0].nombre.endsWith('.mp4') || item.multimedia[0].nombre.endsWith('.mov') ? (
                    <Video style={styles.activityImage} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }}/>
                    ) : (
                    <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                    )}
        <View style={styles.activityInfo}>
          <Text style={styles.activityText}>Series: {item.series}</Text>
          <Text style={styles.activityText}>Repeticiones: {item.repeticiones}</Text>
          {tienePeligro && (
                  <TouchableOpacity style={styles.dangerButton} onPress={()=> alert('Este ejercicio presenta riesgos para la salud')}>
                    <FontAwesome name="exclamation-triangle" size={16} color="red" />
                  </TouchableOpacity>
                  )}
          {item.maquina && (
            <TouchableOpacity
              style={styles.activityButton}
              onPress={() => handleMachinePress(item.maquina)}
            ><Text style={styles.maquinaDetalles}>
              <FontAwesome name="cog" style={styles.activityButtonIcon} /> Maquina
              </Text>            
              </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={activities} renderItem={renderActivity} keyExtractor={(item) => item.id} />
      {selectedMaquina && (
        <Modal visible={true} animationType="slide">
            <View style={styles.modalContainer}>
            <Image source={{ uri: `http://${IP}/img/maquinas/${selectedMaquina.id}/${selectedMaquina.imagen}` }} style={styles.imagenModal} />
            <Text style={styles.modalTitle}>{selectedMaquina.nombre}</Text>
            <Text style={styles.modalSubtitle}>Fecha de registro: {selectedMaquina.registro}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleModalMaquinaClose}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
        </Modal>
        )}
        {selectedActivity && (
        <Modal visible={true} animationType="slide">
            <View style={styles.modalContainer}>
            {selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.jpg') || selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.png') || selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.jpeg') || selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.gif') ? (
                    <Image style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedActivity?.id}/${selectedActivity?.multimedia[currentImageIndex].nombre}` }} />
                    ) : selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.mp4') || selectedActivity?.multimedia[currentImageIndex].nombre.endsWith('.mov') ? (
                    <Video style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedActivity?.id}/${selectedActivity?.multimedia[currentImageIndex].nombre}` }} useNativeControls={true}
                    isLooping={true}/>
                    ) : (
                    <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                    )}
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex - 1)} disabled={currentImageIndex === 0} style={{display: currentImageIndex === 0 ? "none" : "flex"}}>
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex + 1)} disabled={currentImageIndex === selectedActivity?.multimedia.length - 1} style={{display: currentImageIndex === selectedActivity?.multimedia.length - 1 ? "none" : "flex"}}>
              <FontAwesome name="arrow-right" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedActivity.nombre}</Text>
            <Text style={styles.modalSubtitle}>Numero de Series: {selectedActivity.series}</Text>
            <Text style={styles.modalSubtitle}>Numero de Repeticiones: {selectedActivity.series}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleModalActividadClose}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
        </Modal>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B3654',
    paddingTop: 20,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFCC99',
  },
  activityImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  imagenModal: {
    width: 300,
    height: 300,
  },
  activityInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activityText: {
    fontSize: 18,
    marginBottom: 5,
  },
  activityButton: {
    backgroundColor: '#3498db',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  activityButtonIcon: {
    color: '#fff',
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 18,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalCloseIcon: {
    fontSize: 30,
    color: '#333',
  },
  maquinaDetalles:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default ActivitiesScreen;
