import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import Rating from './Rating';
import IP from '../config';

const Tab = createBottomTabNavigator();

function MisReservasScreen({navigation}){
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idReserva, setidReserva] = useState(0);
  const [valoracion, setValoracion] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');


  const cargarReservas = () => {
    fetch(`http://${IP}/reservas`)
      .then(respuesta => respuesta.json())
      .then(data => setReservas(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarReservas();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarReservas();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function fetchRol() {
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setRol(userData.tipoUser);
    }
    fetchRol();
  }, []);

  const handleValorarPress = (idRe) => {
    setidReserva(idRe);
    setModalVisible(true);
  };
  async function handleEnviarValoracion() {
    try {
      const requestData = {
        puntos: valoracion
      };
      const respuesta = await fetch(`http://${IP}/valorarMovil/${idReserva}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (respuesta.ok) {
        cargarReservas();
        setModalVisible(false);
        alert('La reserva ha sido valorada correctamente');
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function handleFinalizarPress(idR) {
    try {
      const respuesta = await fetch(`http://${IP}/reservarMovil/finalizar/${idR}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (respuesta.ok) {
        cargarReservas();
        setModalVisible(false);
        alert('La reserva ha sido finalizada correctamente');
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function eliminarReserva(id){
    try {
        const respuesta = await fetch(`http://${IP}/reservar/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
          cargarReservas();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }

  const reservasInfiltradas = reservas.filter(reserva => {
    const textoBusqueda = reserva.title.toLowerCase() + reserva.monitor.nombre.toLowerCase() + reserva.rutina.nombre.toLowerCase() + reserva.cliente.nombre.toLowerCase()+ reserva.start.toLowerCase();
    return textoBusqueda.includes(busqueda.toLowerCase());
  });

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.reservaContainer}>
        <View style={styles.reservaInfo}>
          <Text style={styles.reservaTitle}>{item.title}</Text>
          {item.rutina !=null ? (
            <Text style={styles.reservaText}>Nombre Rutina: {item.rutina.nombre}</Text>
          ):(
            <Text style={styles.reservaText}>Nombre Rutina: NO DISPONIBLE</Text>
          )}
          {rol === 'cliente' && (
            <View>
              <Text style={styles.reservaText}>Nombre Monitor: {item.monitor.nombre}</Text>
              <Text style={styles.reservaText}>Correo Monitor: {item.monitor.email}</Text>
            </View>
          )}
          {rol === 'monitor' && (
            <View>
            <Text style={styles.reservaText}>Nombre Cliente: {item.cliente.nombre}</Text>
            <Text style={styles.reservaText}>Correo Cliente: {item.cliente.email}</Text>
          </View>
          )}
          {rol === 'admin' && (
            <View>
            <Text style={styles.reservaText}>Nombre Monitor: {item.monitor.nombre}</Text>
            <Text style={styles.reservaText}>Correo Monitor: {item.monitor.email}</Text>
            <Text style={styles.reservaText}>Nombre Cliente: {item.cliente.nombre}</Text>
            <Text style={styles.reservaText}>Correo Cliente: {item.cliente.email}</Text>
          </View>
          )}

          <Text style={styles.reservaText}>Fecha: {Moment.tz(item.start, 'Europe/Madrid').format('DD/MM/YYYY hh:mm a')}</Text>
          <Text style={styles.reservaText}>Estado: {item.estado}</Text>
        </View>
        {rol== 'cliente'  && item.rutina != null && item.estado === 'Finalizada' && !item.valorada && (
          <TouchableOpacity style={styles.valorarButton} onPress={() => handleValorarPress(item.id)}>
            <Text style={styles.valorarTexto}><FontAwesome name="star" size={20} color="#FFFFFF" /> Valorar</Text>
          </TouchableOpacity>
        )}
        {(rol== 'cliente'  || rol== 'monitor') && (
          <TouchableOpacity style={styles.eliminarButton} onPress={() => eliminarReserva(item.id)}>
            <Text style={styles.eliminarTexto}><FontAwesome name="trash" size={20} color="#FFFFFF" /> Eliminar</Text>
          </TouchableOpacity>
        )}
        {rol== 'monitor' && item.estado === 'Pendiente' && (
          <TouchableOpacity style={styles.finalizarButton} onPress={() => handleFinalizarPress(item.id)}>
            <Text style={styles.finalizarTexto}><FontAwesome name="check-circle" size={20} color="#FFFFFF" /> finalizar</Text>
          </TouchableOpacity>
        )}
      </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar la reserva"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      ) : (
        <FlatList
          data={reservasInfiltradas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Valorar reserva</Text>
          <View style={styles.modalBody}>
          <Rating defaultValue={valoracion} onChange={setValoracion} />
            <View style={styles.modalButtons}>
            <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setModalVisible(false);
                  setValoracion(1);
                }}
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
  const [favoritasRutinas, setFavoritasRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');

  const cargarRutinas = () => {
    fetch(`http://${IP}/rutinasMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setRutinas(data))
      .catch(error => console.error(error));
  };
  const cargarFavoritos = () => {
    fetch(`http://${IP}/favoritosMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setFavoritasRutinas(data))
      .catch(error => console.error(error));
  };
  useEffect(() => {
    cargarRutinas();
    cargarFavoritos();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarRutinas();
      cargarFavoritos();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function fetchRol() {
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setRol(userData.tipoUser);
    }
    fetchRol();
  }, []);

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const handleReservarPress = (id) => {
    navigation.navigate('Reserva', { rutinaID: id });
  };

  async function handleAnadirFavoritosPress(id) {
    try {
      const respuesta = await fetch(`http://${IP}/anadirFavoritosMovil/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        cargarRutinas();
        cargarFavoritos();
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function handleEliminarFavoritosPress(id) {
    try {
      const respuesta = await fetch(`http://${IP}/eliminarDeFavoritosMovil/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        cargarRutinas();
        cargarFavoritos();
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const rutinasInfiltradas = rutinas.filter(rutina => {
    const textoBusqueda = rutina.nombre.toLowerCase() + rutina.creador?.nombre.toLowerCase() + rutina.creador?.email.toLowerCase();
    return textoBusqueda.includes(busqueda.toLowerCase());
  });
  

  const renderRutina = ({ item }) => {
    const enFavoritos = favoritasRutinas.some((favorito) => favorito.id === item.id);
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
            { rol == 'cliente' && (
              enFavoritos ? (
                <TouchableOpacity onPress={() => handleEliminarFavoritosPress(item.id)}>
                  <Text style={styles.rutinaBotonTexto}><FontAwesome name="heart" size={20} color="#FF0000" /></Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleAnadirFavoritosPress(item.id)}>
                  <Text style={styles.rutinaBotonTexto}><FontAwesome name="heart-o" size={20} color="#FF0000" /></Text>
                </TouchableOpacity>
              )
            )}
            { rol == 'cliente' &&(
              <TouchableOpacity style={styles.rutinaBotonReservar} onPress={() => handleReservarPress(item.id)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="calendar-plus-o" size={20} color="#FFFFFF" /> Reservar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    );
 };

  return (
    <View style={styles.container}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar rutina"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={rutinasInfiltradas}
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
  const [favoritasRutinas, setFavoritasRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');

  const cargarRutinas = () => {
    fetch(`http://${IP}/rutinasDestacadasMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setRutinas(data))
      .catch(error => console.error(error));
  };
  const cargarFavoritos = () => {
    fetch(`http://${IP}/favoritosMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setFavoritasRutinas(data))
      .catch(error => console.error(error));
  };
  useEffect(() => {
    cargarRutinas();
    cargarFavoritos();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarRutinas();
      cargarFavoritos();
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  

  useEffect(() => {
    async function fetchRol() {
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setRol(userData.tipoUser);
    }
    fetchRol();
  }, []);

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const handleReservarPress = (id) => {
    navigation.navigate('Reserva', { rutinaID: id });
  };
  async function handleAnadirFavoritosPress(id) {
    try {
      const respuesta = await fetch(`http://${IP}/anadirFavoritosMovil/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        cargarRutinas();
        cargarFavoritos();
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function handleEliminarFavoritosPress(id) {
    try {
      const respuesta = await fetch(`http://${IP}/eliminarDeFavoritosMovil/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        cargarRutinas();
        cargarFavoritos();
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const rutinasInfiltradas = rutinas.filter(rutina => {
    const textoBusqueda = rutina.nombre.toLowerCase() + rutina.creador?.nombre.toLowerCase() + rutina.creador?.email.toLowerCase();
    return textoBusqueda.includes(busqueda.toLowerCase());
  });

  const renderRutina = ({ item }) => {
    const enFavoritos = favoritasRutinas.some((favorito) => favorito.id === item.id);

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
            { rol == 'cliente' && (
              enFavoritos ? (
                <TouchableOpacity onPress={() => handleEliminarFavoritosPress(item.id)}>
                  <Text style={styles.rutinaBotonTexto}><FontAwesome name="heart" size={20} color="#FF0000" /></Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleAnadirFavoritosPress(item.id)}>
                  <Text style={styles.rutinaBotonTexto}><FontAwesome name="heart-o" size={20} color="#FF0000" /></Text>
                </TouchableOpacity>
              )
            )}
            { rol == 'cliente' &&(
              <TouchableOpacity style={styles.rutinaBotonReservar} onPress={() => handleReservarPress(item.id)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="calendar-plus-o" size={20} color="#FFFFFF" /> Reservar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    );
 };

  return (
    <View style={styles.container}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar rutina"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={rutinasInfiltradas}
          renderItem={renderRutina}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};
function Favoritas({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [favoritasRutinas, setFavoritasRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const cargarFavoritos = () => {
    fetch(`http://${IP}/favoritosMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setFavoritasRutinas(data))
      .catch(error => console.error(error));
  };
  useEffect(() => {
    cargarFavoritos();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarFavoritos();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const handleReservarPress = (id) => {
    navigation.navigate('Reserva', { rutinaID: id });
  };
  async function handleEliminarFavoritosPress(id) {
    try {
      const respuesta = await fetch(`http://${IP}/eliminarDeFavoritosMovil/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        cargarFavoritos();
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const rutinasInfiltradas = favoritasRutinas.filter(rutina => {
    return rutina.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

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
            <TouchableOpacity onPress={() => handleEliminarFavoritosPress(item.id)}>
              <Text style={styles.rutinaBotonTexto}><FontAwesome name="heart" size={20} color="#FF0000" /></Text>
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
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar por nombre rutina"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : (
        <FlatList
          data={rutinasInfiltradas}
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
    eliminarButton: {
      backgroundColor: '#FF1212',
      padding: 8,
      borderRadius: 5,
      alignSelf: 'flex-start',
    },
    eliminarTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row",
      alignItems: "center",
    },
    finalizarButton: {
      backgroundColor: '#00FFAE',
      padding: 8,
      borderRadius: 5,
      alignSelf: 'flex-end',
    },
    valorarTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row",
      alignItems: "center",
    },
    finalizarTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: 'bold',
      color:'white',
    },
    rutinaContainer: {
      borderRadius: 10,
      marginHorizontal: 20,
      marginVertical: 10,
      marginBottom: 10,
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

function MyTabs({rol}) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Rutinas') {
            iconName = focused ? 'weight-lifter' : 'weight-lifter';
          } else if (route.name === 'Mis Reservas') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          }  else if (route.name === 'Reservas con Cliente') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          }  else if (route.name === 'Reservas sistema') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Destacadas') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Favoritas') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rutinas" component={RutinasScreen} options={{ headerShown: false }} />
      {rol == 'monitor' && (
      <Tab.Screen name="Reservas con Cliente" component={MisReservasScreen} options={{ headerShown: false }}/>
      )}
      {rol == 'cliente' && (
      <Tab.Screen name="Mis Reservas" component={MisReservasScreen} options={{ headerShown: false }}/>
      )}
      {rol == 'admin' && (
      <Tab.Screen name="Reservas sistema" component={MisReservasScreen} options={{ headerShown: false }}/>
      )}
      <Tab.Screen name="Destacadas" component={Destacadas} options={{ headerShown: false }}/>
      {rol == 'cliente' && (
      <Tab.Screen name="Favoritas" component={Favoritas} options={{ headerShown: false }}/>
      )}
    </Tab.Navigator>
  );
}

export default function Ejercicios({ navigation }) {
  const [rol, setRol] = useState('');
  useEffect(() => {
    async function fetchRol() {
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setRol(userData.tipoUser);
    }
    fetchRol();
  }, []);
    return (
      <View style={{ flex: 1,backgroundColor:'#F8E3AF'}}>
        <MyTabs rol={rol}/>
      </View>
    );
}