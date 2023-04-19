import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Video } from 'expo-av'; 
import IP from '../config';
const Tab = createBottomTabNavigator();

function VerMaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    async function fetchMaquinas() {
      try {
        const response = await fetch(`http://${IP}/maquinasSala`);
        const data = await response.json();
        setMaquinas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMaquinas();
  }, []);

  const maquinasInfiltradas = maquinas.filter(maquina => {
    return maquina.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

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
                <View style={styles.maquinaCard}>
                  <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/maquinas/${item.id}/${item.imagen}` }} />
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
            <Image source={{ uri: `http://${IP}/img/maquinas/${selectedMaquina?.id}/${selectedMaquina?.imagen}` }} style={styles.imagenModal} />
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
}
function VerEjerciciosScreen() {
  const [enfermedades, setEnfermedades] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleMaquina, setModalVisibleMaquina] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [busqueda, setBusqueda] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setCurrentImageIndex(0);
  };
  const toggleModalMaquina = () => {
    setModalVisibleMaquina(!isModalVisibleMaquina);
  };

  useEffect(() => {
    async function fetchEjercicios() {
      try {
        const response = await fetch(`http://${IP}/actividadesMovil`);
        const data = await response.json();
        setEjercicios(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEjercicios();
  }, []);

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

  const ejerciciosInfiltrados = ejercicios.filter(ejercicio => {
    return ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });


  const renderEjercicios = ({item})=>{
    const tienePeligro = enfermedades.some((enfermedad) => enfermedad.zonaEvitar === item.zonaCuerpo);
    return(
      <TouchableOpacity
              onPress={() => {
                setSelectedEjercicio(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
                <View style={styles.maquinaCard}>
                    {item.multimedia[0].nombre.endsWith('.jpg') || item.multimedia[0].nombre.endsWith('.png') || item.multimedia[0].nombre.endsWith('.jpeg') || item.multimedia[0].nombre.endsWith('.gif') ? (
                    <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />
                    ) : item.multimedia[0].nombre.endsWith('.mp4') || item.multimedia[0].nombre.endsWith('.mov') ? (
                    <Video style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />
                    ) : (
                    <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                    )}
                  <Text style={styles.maquinaNombre}>{item.nombre} {tienePeligro && (
                  <TouchableOpacity style={styles.dangerButton} onPress={()=> alert('Este ejercicio presenta riesgos para la salud')}>
                    <FontAwesome name="exclamation-triangle" size={16} color="red" />
                  </TouchableOpacity>
                  )}
                  </Text>
                  {item.maquina !== null && (
                    <View style={styles.activityInfo}>
                      <TouchableOpacity style={styles.activityButton} onPress={() => {setSelectedEjercicio(item);toggleModalMaquina();}}>
                        <Text style={styles.maquinaDetalles}>
                          <FontAwesome name="cog" style={styles.activityButtonIcon} /> Maquina
                        </Text>
                      </TouchableOpacity>  
                    </View>
                  )}
                </View>
              </Card>
        </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar por nombre ejercicio"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={ejerciciosInfiltrados}
          renderItem={renderEjercicios}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} animationType="slide">
            <View style={styles.modalContainer}>
            {selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.png') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpeg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.gif') ? (
                    <Image style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }} />
                    ) : selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mp4') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mov') ? (
                    <Video style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }} useNativeControls={true}
                    isLooping={true}/>
                    ) : (
                    <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                    )}
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex - 1)} disabled={currentImageIndex === 0} style={{display: currentImageIndex === 0 ? "none" : "flex"}}>
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex + 1)} disabled={currentImageIndex === selectedEjercicio?.multimedia.length - 1} style={{display: currentImageIndex === selectedEjercicio?.multimedia.length - 1 ? "none" : "flex"}}>
              <FontAwesome name="arrow-right" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedEjercicio?.nombre}</Text>
            <Text style={styles.modalSubtitle}>Numero de Series: {selectedEjercicio?.series}</Text>
            <Text style={styles.modalSubtitle}>Numero de Repeticiones: {selectedEjercicio?.series}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
      </Modal>
      {selectedEjercicio?.maquina && (
      <Modal isVisible={isModalVisibleMaquina} onBackdropPress={toggleModalMaquina} animationType="slide">
            <View style={styles.modalContainer}>
            <Image source={{ uri: `http://${IP}/img/maquinas/${selectedEjercicio?.maquina.id}/${selectedEjercicio?.maquina.imagen}` }} style={styles.imagenModal} />
            <Text style={styles.modalTitle}>{selectedEjercicio?.maquina.nombre}</Text>
            <Text style={styles.modalSubtitle}>Fecha de registro: {selectedEjercicio?.maquina.registro}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModalMaquina}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
        </Modal>
     )}
    </View>
  );
}
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Ver Maquinas') {
            iconName = focused ? 'dumbbell' : 'dumbbell';
          } else if (route.name === 'Ver Ejericios') {
            iconName = focused ? 'weight-lifter' : 'weight-lifter';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Ver Maquinas" component={VerMaquinasScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Ver Ejericios" component={VerEjerciciosScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
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
});

export default function Servicios() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
