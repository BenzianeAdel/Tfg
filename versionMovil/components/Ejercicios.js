import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { random } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import Moment from 'moment';
import 'moment-timezone';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import IP from '../config';

const Tab = createBottomTabNavigator();

function MisReservasScreen(){
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idReserva, setidReserva] = useState(0);
  const [idRutina, setidRutina] = useState(0);
  const [valoracion, setValoracion] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchReservas() {
      try {
        const response = await fetch(`http://${IP}/reservas`);
        const data = await response.json();
        setReservas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReservas();
  }, [reservas]);

  const handleValorarPress = (idRe,idRu) => {
    setidReserva(idRe);
    setidRutina(idRu)
    setModalVisible(true);
  };
  async function handleEnviarValoracion() {
    console.log(valoracion);
    try {
      const requestData = {
        puntos: valoracion
      };
      const respuesta = await fetch(`http://${IP}/valorarMovil/${idReserva}/${idRutina}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (respuesta.ok) {
        setModalVisible(false);
        alert('La reserva ha sido valorada correctamente');
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.reservaContainer}>
        <View style={styles.reservaInfo}>
          <Text style={styles.reservaTitle}>{item.title}</Text>
          <Text style={styles.reservaText}>Nombre Rutina: {item.rutina.nombre}</Text>
          <Text style={styles.reservaText}>Nombre Monitor: {item.monitor.nombre}</Text>
          <Text style={styles.reservaText}>Correo Monitor: {item.monitor.email}</Text>
          <Text style={styles.reservaText}>Fecha: {Moment.tz(item.start, 'Europe/Madrid').format('DD/MM/YYYY hh:mm a')}</Text>
          <Text style={styles.reservaText}>Estado: {item.estado}</Text>
        </View>
        {item.estado === 'Finalizada' && !item.valorada && (
          <TouchableOpacity style={styles.valorarButton} onPress={() => handleValorarPress(item.id,item.rutina.id)}>
            <Text style={styles.valorarTexto}><FontAwesome name="star" size={20} color="#FFFFFF" /> Valorar</Text>
          </TouchableOpacity>
        )}
      </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      ) : (
        <FlatList
          data={reservas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Valorar reserva</Text>
          <View style={styles.modalBody}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={valoracion}
              selectedStar={(rating) => setValoracion(rating)}
              fullStarColor="#F2C94C"
              emptyStarColor="#EAEAEA"
            />
            <View style={styles.modalButtons}>
            <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="close" style={styles.modalCloseIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.enviarButton}
                onPress={() => handleEnviarValoracion()}
              >
                <Text style={styles.enviarTexto}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );  
}
function RutinasScreen({navigation}){
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRutinas() {
      try {
        const response = await fetch(`http://${IP}/rutinasMovil`);
        const data = await response.json();
        setRutinas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRutinas();
  }, []);

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const handleReservarPress = (id) => {
    navigation.navigate('Reserva', { rutinaID: id });
  };

  const renderRutina = ({ item }) => {
    return (
      <Card containerStyle={styles.rutinaContainer}>
        <View style={styles.rutinaCard}>
          <Text style={styles.rutinaNombre}>{item.nombre}</Text>
          <View style={styles.rutinaInfo}>
            <Text style={styles.rutinaPuntos}><FontAwesome name="star" size={16} color="#FDB813" /> {item.puntos}</Text>
            <Text style={styles.rutinaActividades}>Actividades: {item.actividades.length}</Text>
          </View>
          <View style={styles.rutinaBotones}>
            <TouchableOpacity style={styles.rutinaBotonDetalle} onPress={() => handleDetallePress(item.actividades)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="list" size={20} color="#FFFFFF" /> Detalle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rutinaBotonReservar} onPress={() => handleReservarPress(item.id)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="calendar-plus-o" size={20} color="#FFFFFF" /> Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
 };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={rutinas}
          renderItem={renderRutina}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

function Destacadas({ navigation }) {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRutinas() {
      try {
        const response = await fetch(`http://${IP}/rutinasDestacadasMovil`);
        const data = await response.json();
        setRutinas(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchRutinas();
  }, []);

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const handleReservarPress = (id) => {
    navigation.navigate('Reserva', { rutinaID: id });
  };

  const renderRutina = ({ item }) => {
    return (
      <Card containerStyle={styles.rutinaContainer}>
        <View style={styles.rutinaCard}>
          <Text style={styles.rutinaNombre}>{item.nombre}</Text>
          <View style={styles.rutinaInfo}>
            <Text style={styles.rutinaPuntos}><FontAwesome name="star" size={16} color="#FDB813" /> {item.puntos}</Text>
            <Text style={styles.rutinaActividades}>Actividades: {item.actividades.length}</Text>
          </View>
          <View style={styles.rutinaBotones}>
            <TouchableOpacity style={styles.rutinaBotonDetalle} onPress={() => handleDetallePress(item.actividades)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="list" size={20} color="#FFFFFF" /> Detalle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rutinaBotonReservar} onPress={() => handleReservarPress(item.id)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="calendar-plus-o" size={20} color="#FFFFFF" /> Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
 };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={rutinas}
          renderItem={renderRutina}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};
  
const styles = StyleSheet.create({
    reservaContainer: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    reservaTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 5,
    },
    reservaText: {
      fontSize: 14,
      marginBottom: 5,
    },
    reservaRutina: {
      fontSize: 16,
      marginBottom: 5,
    },
    reservaMonitor: {
      fontSize: 16,
      marginBottom: 5,
    },
    reservaCorreo: {
      fontSize: 16,
      marginBottom: 5,
    },
    reservaFecha: {
      fontSize: 16,
      marginBottom: 5,
    },
    reservaEstado: {
      fontSize: 16,
      marginBottom: 5,
    },
    valorarButton: {
      backgroundColor: '#FFD700',
      padding: 8,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    containerReserva: {
      flex: 1,
      backgroundColor: '#F8E3AF',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    container: {
      flex: 1,
      backgroundColor: '#6B3654',
    },
    loadingText: {
      fontSize: 20,
      textAlign: 'center',
      marginTop: 50,
    },
    rutinaContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      marginVertical: 10,
    },
    rutinaCard: {
      padding: 10,
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: '60%',
      alignSelf: 'center',
      marginTop: '20%',
      marginBottom: '20%',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
    },
    modalBody: {
      alignItems: "center",
    },
    modalButtons: {
      flexDirection: "row",
      marginTop: 16,
    },
    cancelarButton: {
      backgroundColor: "#EB5757",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginRight: 8,
    },
    cancelarTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    enviarButton: {
      backgroundColor: "#219653",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginRight: 8,
    },
    enviarTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalCloseButton: {
      backgroundColor: "#EAEAEA",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 8,
      marginRight: 8,
    },
    modalCloseIcon: {
      fontSize: 20,
      color: "#BBBBBB",
    },
    rutinaNombre: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    rutinaInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    rutinaPuntos: {
      fontSize: 16,
    },
    rutinaActividades: {
      fontSize: 16,
    },
    rutinaBotones: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rutinaBotonDetalle: {
      backgroundColor: '#3498db',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    rutinaBotonReservar: {
      backgroundColor: '#2ecc71',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    rutinaBotonTexto: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
});

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Rutinas') {
            iconName = focused ? 'weight-lifter' : 'weight-lifter';
          } else if (route.name === 'Mis Reservas') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Destacadas') {
            iconName = focused ? 'star' : 'star-outline';
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
      <Tab.Screen name="Rutinas" component={RutinasScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Mis Reservas" component={MisReservasScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Destacadas" component={Destacadas} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default function Ejercicios({ navigation }) {
    return (
      <View style={{ flex: 1,backgroundColor:'#F8E3AF'}}>
        <MyTabs />
      </View>
    );
  }