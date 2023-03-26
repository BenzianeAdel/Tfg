import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
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
        const response = await fetch('http://192.168.1.129:8080/maquinasSala');
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
                  <Image style={styles.maquinaImagen} source={{ uri: `http://192.168.1.129:8080/img/${item.imagen}` }} />
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedMaquina?.nombre}</Text>
          <Image style={styles.maquinaImagenModal} source={{ uri: `http://192.168.1.129:8080/img/${selectedMaquina?.imagen}` }} />
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    async function fetchEjercicios() {
      try {
        const response = await fetch('http://192.168.1.129:8080/actividadesMovil');
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
                  <Image style={styles.maquinaImagen} source={{ uri: `http://192.168.1.129:8080/img/${item.imagen}` }} />
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedEjercicio?.nombre}</Text>
          <Image style={styles.maquinaImagenModal} source={{ uri: `http://192.168.1.129:8080/img/${selectedEjercicio?.imagen}` }} />
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
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  maquinaCard: {
    borderRadius: 10,
    marginBottom: 10,
  },
  maquinaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maquinaImagen: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  maquinaImagenModal: {
    width: 300,
    height: 300,
  },
  maquinaNombre: {
    fontSize: 20,
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
});

export default function Servicios() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
