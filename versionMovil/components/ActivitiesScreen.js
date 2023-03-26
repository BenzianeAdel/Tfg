import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const ActivitiesScreen = ({ route }) => {
  const { activities } = route.params;
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedMaquina, setSelectedMaquina] = useState(null);

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
  };
  const handleModalMaquinaClose = () => {
    setSelectedMaquina(null);
  };

  const renderActivity = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.activityContainer}
        onPress={() => handleActivityPress(item)}
      >
        <Image source={{ uri: `http://192.168.1.129:8080/img/${item.imagen}` }} style={styles.activityImage}  />
        <View style={styles.activityInfo}>
          <Text style={styles.activityText}>Series: {item.series}</Text>
          <Text style={styles.activityText}>Repeticiones: {item.repeticiones}</Text>
          {item.maquina && (
            <TouchableOpacity
              style={styles.activityButton}
              onPress={() => handleMachinePress(item.maquina)}
            >
              <FontAwesome name="cog" style={styles.activityButtonIcon} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={activities} renderItem={renderActivity} keyExtractor={(item) => item.id} />
      {selectedMaquina && (
        <Modal visible={true} animationType="slide">
            <View style={styles.modalContainer}>
            <Image source={{ uri: `http://192.168.1.129:8080/img/${selectedMaquina.imagen}` }} style={styles.imagenModal} />
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
            <Image source={{ uri: `http://192.168.1.129:8080/img/${selectedActivity.imagen}` }} style={styles.imagenModal} />
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
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
  },
  activityImage: {
    width: 80,
    height: 80,
    marginRight: 10,
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
});

export default ActivitiesScreen;
