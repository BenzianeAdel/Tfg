import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import IP from '../config';

const GestionScreenAdmin = ({navigation}) => {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const cargarMaquinas = () => {
    fetch(`http://${IP}/maquinasSala`)
      .then(respuesta => respuesta.json())
      .then(data => setMaquinas(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarMaquinas();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarMaquinas();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const maquinasInfiltradas = maquinas.filter(maquina => {
    return maquina.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });
  const anyadirMaquina = () => {
    navigation.navigate('Nueva Maquina');
  };

  async function eliminarMaquina(id){
    try {
        const respuesta = await fetch(`http://${IP}/maquinasMovil/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
          cargarMaquinas();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }
  const editarMaquina = (maquina) => {
    navigation.navigate('Editar Maquina',{ maquina: maquina });
  };

  return (
    <View style={styles.container}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar por nombre maquina"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirMaquina()}>
        <Text style={styles.textoBotonCrear}><Icon name='plus' type='font-awesome-5' color='#FFDC00' size={20} /> Añadir Maquina</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={maquinasInfiltradas}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedMaquina(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
                  <View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity style={styles.botonEditar} onPress={() => editarMaquina(item)}>
                      <Text style={styles.textoBotonEditar}><Icon name='edit' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarMaquina(item.id)}>
                      <Text style={styles.textoBotonEliminar}><Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                  </View>
                <View style={styles.maquinaCard}>
                  {item.imagen!="" ? (
                      <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/maquinas/${item.id}/${item.imagen}` }} />
                  ):(
                    <Text>No existe Imagen</Text>
                  )}
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} animationType="slide">
            <View style={styles.modalContainer}>
            {selectedMaquina?.imagen!="" ? (
                    <Image source={{ uri: `http://${IP}/img/maquinas/${selectedMaquina?.id}/${selectedMaquina?.imagen}` }} style={styles.imagenModal} />
            ):(
                    <Text>No existe Imagen</Text>
            )}
            <Text style={styles.modalTitle}>{selectedMaquina?.nombre}</Text>
            <Text style={styles.modalSubtitle}>Fecha de registro: {selectedMaquina?.registro}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B3654',
    padding: 10,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
  },
  maquinaCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  maquinaContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  maquinaImagen: {
    width: 70,
    height: 90,
    marginRight: 10,
    borderRadius: 10,
  },
  maquinaImagenModal: {
    width: 300,
    height: 300,
  },
  maquinaNombre: {
    fontSize: 20,
    fontWeight:'bold',
  },
  activityText: {
    fontSize: 18,
    marginBottom: 5,
  },
  activityInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imagenModal: {
    width: 300,
    height: 300,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  imageButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  imageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  busquedaContainer: {
    padding: 10,
    backgroundColor: '#6B3654',
  },
  busquedaInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  botonEliminar: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    alignSelf:'flex-end',
  },
  textoBotonEliminar: {
    color: 'white',
    fontSize: 16,
  },
  botonEditar: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignSelf:'flex-end',
  },
  textoBotonEditar: {
    color: 'white',
    fontSize: 16,
  },
  botonCrear: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textoBotonCrear: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
  },
  });
  export default GestionScreenAdmin;