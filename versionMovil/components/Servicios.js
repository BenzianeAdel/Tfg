import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import IP from '../config';
const Tab = createBottomTabNavigator();

function VerMaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={maquinas}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedMaquina(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
                <View style={styles.maquinaCard}>
                  <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/${item.imagen}` }} />
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
            <Image source={{ uri: `http://${IP}/img/${selectedMaquina?.imagen}` }} style={styles.imagenModal} />
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
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleMaquina, setModalVisibleMaquina] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={ejercicios}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedEjercicio(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
                <View style={styles.maquinaCard}>
                  <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/${item.imagen}` }} />
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text>
                  <View style={styles.activityInfo}>
                  <TouchableOpacity style={styles.activityButton} onPress={() => {setSelectedEjercicio(item);toggleModalMaquina();}}>
                    <Text style={styles.maquinaDetalles}>
                    <FontAwesome name="cog" style={styles.activityButtonIcon} /> Maquina
                    </Text>
                  </TouchableOpacity>
                  </View>     
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} animationType="slide">
            <View style={styles.modalContainer}>
            <Image source={{ uri: `http://${IP}/img/${selectedEjercicio?.imagen}` }} style={styles.imagenModal} />
            <Text style={styles.modalTitle}>{selectedEjercicio?.nombre}</Text>
            <Text style={styles.modalSubtitle}>Numero de Series: {selectedEjercicio?.series}</Text>
            <Text style={styles.modalSubtitle}>Numero de Repeticiones: {selectedEjercicio?.series}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
      </Modal>
      <Modal isVisible={isModalVisibleMaquina} onBackdropPress={toggleModalMaquina} animationType="slide">
            <View style={styles.modalContainer}>
            <Image source={{ uri: `http://${IP}/img/${selectedEjercicio?.maquina.imagen}` }} style={styles.imagenModal} />
            <Text style={styles.modalTitle}>{selectedEjercicio?.maquina.nombre}</Text>
            <Text style={styles.modalSubtitle}>Fecha de registro: {selectedEjercicio?.maquina.registro}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModalMaquina}>
                <FontAwesome name="close" style={styles.modalCloseIcon} />
            </TouchableOpacity>
            {/* contenido adicional de la modal */}
            </View>
        </Modal>
    </View>
  );
}
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        tabStyle: { backgroundColor: '#fff' },
        labelStyle: { fontSize: 12 },
      }}
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
  }
});

export default function Servicios() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
