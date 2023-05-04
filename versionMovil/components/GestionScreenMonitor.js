import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import IP from '../config';
const Tab = createBottomTabNavigator();

function GestionActividades({navigation}){
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEjercicio, setSelectedEjercicio] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleMaquina, setModalVisibleMaquina] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [id,setId] = useState(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setCurrentImageIndex(0);
  };
  const toggleModalMaquina = () => {
    setModalVisibleMaquina(!isModalVisibleMaquina);
  };

  const cargarEjercicios = () => {
    fetch(`http://${IP}/actividadesMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setEjercicios(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarEjercicios();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarEjercicios();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function obtenerLogueado() {
      try {     
        const storedData = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        setId(userData.id);
      } catch (error) {
        console.error(error);
      }
    }
    obtenerLogueado();
  }, []);

  async function eliminarActividad(id){
    try {
        const respuesta = await fetch(`http://${IP}/actividadesMovil/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
            cargarEjercicios();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }
  const ejerciciosInfiltrados = ejercicios.filter(ejercicio => {
    const textoBusqueda = ejercicio.nombre.toLowerCase() + ejercicio.creador?.nombre.toLowerCase() + ejercicio.creador?.email.toLowerCase();
    return textoBusqueda.includes(busqueda.toLowerCase());
  });
  const anyadirActividad = () => {
    navigation.navigate('Nueva Actividad');
  };

  const editarActividad = (actividad) => {
    navigation.navigate('Editar Actividad',{ actividad: actividad });
  };

  const renderEjercicios = ({item})=>{
    return(
      <TouchableOpacity
              onPress={() => {
                setSelectedEjercicio(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
              {(item.creador != null && id == item.creador.id) && (<View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity style={styles.botonEditar} onPress={() => editarActividad(item)}>
                      <Text style={styles.textoBotonEditar}><Icon name='edit' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarActividad(item.id)}>
                      <Text style={styles.textoBotonEliminar}><Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                  </View>)}
                <View style={styles.maquinaCard}>
                {item.multimedia && item.multimedia[0] ? (item.multimedia[0].nombre.endsWith('.jpg') || item.multimedia[0].nombre.endsWith('.png') || item.multimedia[0].nombre.endsWith('.jpeg') || item.multimedia[0].nombre.endsWith('.gif') ? (
                <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />) : item.multimedia[0].nombre.endsWith('.mp4') ||
                item.multimedia[0].nombre.endsWith('.mov') ? (
                <Video style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />
                ) : (
                  <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                )
                ) : <Text>No existe imagen</Text>}
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text> 
                  {item.maquina !== null && (
                  <TouchableOpacity style={styles.activityButton} onPress={() => {setSelectedEjercicio(item);toggleModalMaquina();}}>
                  <Text style={styles.maquinaDetalles}>
                    <FontAwesome name="cog" style={styles.activityButtonIcon} /> Maquina
                  </Text>
                </TouchableOpacity> 
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
          placeholder="Buscar ejercicio"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirActividad()}>
        <Text style={styles.textoBotonCrear}>Añadir Actividad</Text>
      </TouchableOpacity>
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
            {selectedEjercicio?.multimedia && selectedEjercicio?.multimedia[currentImageIndex] ? (selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.png') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpeg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.gif') ? (
                <Image style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }} />) : selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mp4') ||
                selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mov') ? (
                <Video style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }}  useNativeControls={true}
                isLooping={true}/>
                ) : (
                  <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                )
                ) : <Text>No existe imagen</Text>}
            <TouchableOpacity onPress={() => {setCurrentImageIndex(currentImageIndex - 1)}} disabled={currentImageIndex === 0 || selectedEjercicio?.multimedia.length==0} style={{display: currentImageIndex === 0 || selectedEjercicio?.multimedia.length==0 ? "none" : "flex"}}>
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex + 1)} disabled={currentImageIndex === selectedEjercicio?.multimedia.length - 1 || selectedEjercicio?.multimedia.length === 0} style={{display: currentImageIndex === selectedEjercicio?.multimedia.length - 1 || selectedEjercicio?.multimedia.length==0 ? "none" : "flex"}}>
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
            {selectedEjercicio?.maquina.imagen!="" ? (
                    <Image source={{ uri: `http://${IP}/img/maquinas/${selectedEjercicio?.maquina.id}/${selectedEjercicio?.maquina.imagen}` }} style={styles.imagenModal} />
            ):(
                    <Text>No existe Imagen</Text>
            )}  
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
function GestionMisActividades({navigation}){
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

  const cargarEjercicios = () => {
    fetch(`http://${IP}/misactividadesMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setEjercicios(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarEjercicios();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarEjercicios();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function eliminarActividad(id){
    try {
        const respuesta = await fetch(`http://${IP}/actividadesMovil/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
            cargarEjercicios();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }

  const ejerciciosInfiltrados = ejercicios.filter(ejercicio => {
    return ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });
  const anyadirActividad = () => {
    navigation.navigate('Nueva Actividad');
  };

  const editarActividad = (actividad) => {
    navigation.navigate('Editar Actividad',{ actividad: actividad });
  };


  const renderEjercicios = ({item})=>{
    return(
      <TouchableOpacity
              onPress={() => {
                setSelectedEjercicio(item);
                toggleModal();
              }}
            >
              <Card containerStyle={styles.maquinaContainer}>
                  <View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity style={styles.botonEditar} onPress={() => editarActividad(item)}>
                      <Text style={styles.textoBotonEditar}><Icon name='edit' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarActividad(item.id)}>
                      <Text style={styles.textoBotonEliminar}><Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                  </View>
                <View style={styles.maquinaCard}>
                {item.multimedia && item.multimedia[0] ? (item.multimedia[0].nombre.endsWith('.jpg') || item.multimedia[0].nombre.endsWith('.png') || item.multimedia[0].nombre.endsWith('.jpeg') || item.multimedia[0].nombre.endsWith('.gif') ? (
                <Image style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />) : item.multimedia[0].nombre.endsWith('.mp4') ||
                item.multimedia[0].nombre.endsWith('.mov') ? (
                <Video style={styles.maquinaImagen} source={{ uri: `http://${IP}/img/actividades/${item.id}/${item.multimedia[0].nombre}` }} />
                ) : (
                  <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                )
                ) : <Text>No existe imagen</Text>}
                  <Text style={styles.maquinaNombre}>{item.nombre}</Text>
                  {item.maquina !== null && (
                  <TouchableOpacity style={styles.activityButton} onPress={() => {setSelectedEjercicio(item);toggleModalMaquina();}}>
                  <Text style={styles.maquinaDetalles}>
                    <FontAwesome name="cog" style={styles.activityButtonIcon} /> Maquina
                  </Text>
                </TouchableOpacity> 
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
      <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirActividad()}>
        <Text style={styles.textoBotonCrear}>Añadir Actividad</Text>
      </TouchableOpacity>
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
            {selectedEjercicio?.multimedia && selectedEjercicio?.multimedia[currentImageIndex] ? (selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.png') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.jpeg') || selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.gif') ? (
                <Image style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }} />) : selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mp4') ||
                selectedEjercicio?.multimedia[currentImageIndex].nombre.endsWith('.mov') ? (
                <Video style={styles.imagenModal} source={{ uri: `http://${IP}/img/actividades/${selectedEjercicio?.id}/${selectedEjercicio?.multimedia[currentImageIndex].nombre}` }}  useNativeControls={true}
                isLooping={true}/>
                ) : (
                  <Text>No se pudo reconocer el formato del archivo multimedia</Text>
                )
                ) : <Text>No existe imagen</Text>}
            <TouchableOpacity onPress={() => {setCurrentImageIndex(currentImageIndex - 1)}} disabled={currentImageIndex === 0 || selectedEjercicio?.multimedia.length==0} style={{display: currentImageIndex === 0 || selectedEjercicio?.multimedia.length==0 ? "none" : "flex"}}>
              <FontAwesome name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentImageIndex(currentImageIndex + 1)} disabled={currentImageIndex === selectedEjercicio?.multimedia.length - 1 || selectedEjercicio?.multimedia.length === 0} style={{display: currentImageIndex === selectedEjercicio?.multimedia.length - 1 || selectedEjercicio?.multimedia.length==0 ? "none" : "flex"}}>
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
            {selectedEjercicio?.maquina.imagen!="" ? (
                    <Image source={{ uri: `http://${IP}/img/maquinas/${selectedEjercicio?.maquina.id}/${selectedEjercicio?.maquina.imagen}` }} style={styles.imagenModal} />
            ):(
                    <Text>No existe Imagen</Text>
            )}  
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
function GestionRutinas({navigation}){
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritasRutinas, setFavoritasRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [id,setId] = useState(0);

  const cargarRutinas = () => {
    fetch(`http://${IP}/rutinasMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setRutinas(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarRutinas();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarRutinas();
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    async function obtenerLogueado() {
      try {     
        const storedData = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        setId(userData.id);
      } catch (error) {
        console.error(error);
      }
    }
    obtenerLogueado();
  }, []);

  async function eliminarRutina(id){
    try {
        const respuesta = await fetch(`http://${IP}/rutinasMovil/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
          cargarRutinas();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };
  const rutinasInfiltradas = rutinas.filter(rutina => {
    const textoBusqueda = rutina.nombre.toLowerCase() + rutina.actividades.length + rutina.creador?.nombre.toLowerCase() + rutina.creador?.email.toLowerCase();
    return textoBusqueda.includes(busqueda.toLowerCase());
  });

  const anyadirRutina = () => {
    navigation.navigate('Nueva Rutina');
  };

  const editarRutina = (rutina) => {
    navigation.navigate('Editar Rutina',{ rutina: rutina });
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
            {(item.creador != null && id == item.creador.id) && (<View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity style={styles.botonEditar} onPress={() => editarRutina(item)}>
                      <Text style={styles.textoBotonEditar}><Icon name='edit' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarRutina(item.id)}>
                      <Text style={styles.textoBotonEliminar}><Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                  </View>)}
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
      <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirRutina()}>
        <Text style={styles.textoBotonCrear}>Añadir Rutina</Text>
      </TouchableOpacity>
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
}
function GestionMisRutinas({navigation}){
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritasRutinas, setFavoritasRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const cargarRutinas = () => {
    fetch(`http://${IP}/misrutinasMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setRutinas(data))
      .catch(error => console.error(error));
  };

  useEffect(() => {
    cargarRutinas();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarRutinas();
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function eliminarRutina(id){
    try {
        const respuesta = await fetch(`http://${IP}/rutinasMovil/eliminar/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (respuesta.ok) {
          cargarRutinas();
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
  }

  const handleDetallePress = (actividad) => {
    navigation.navigate('Lista Actividades', { activities: actividad });
  };

  const rutinasInfiltradas = rutinas.filter(rutina => {
    const textoBusqueda = rutina.nombre.toLowerCase() + rutina.actividades.length;
    return textoBusqueda.includes(busqueda.toLowerCase());
  });

  const anyadirRutina = () => {
    navigation.navigate('Nueva Rutina');
  };

  const editarRutina = (rutina) => {
    navigation.navigate('Editar Rutina',{ rutina: rutina });
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
            <View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity style={styles.botonEditar} onPress={() => editarRutina(item)}>
                      <Text style={styles.textoBotonEditar}><Icon name='edit' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarRutina(item.id)}>
                      <Text style={styles.textoBotonEliminar}><Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} /></Text>
                    </TouchableOpacity>
            </View>
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
      <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirRutina()}>
        <Text style={styles.textoBotonCrear}>Añadir Rutina</Text>
      </TouchableOpacity>
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B3654',
    padding: 10,
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
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalCloseIcon: {
    fontSize: 30,
    color: '#333',
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
  botonEliminar: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  textoBotonEliminar: {
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
  buttonContainer: {
    marginBottom: 20,
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
  }
});

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

          if (route.name === 'Actividades') {
            iconName = focused ? 'dumbbell' : 'dumbbell';
          } if (route.name === 'Mis Actividades') {
            iconName = focused ? 'weight-lifter' : 'weight-lifter';
          } else if (route.name === 'Rutinas') {
            iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
          } else if (route.name === 'Mis Rutinas') {
            iconName = focused ? 'playlist-plus' : 'playlist-plus';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Mis Actividades" component={GestionMisActividades} options={{ headerShown: false }} />
      <Tab.Screen name="Actividades" component={GestionActividades} options={{ headerShown: false }} />
      <Tab.Screen name="Mis Rutinas" component={GestionMisRutinas} options={{ headerShown: false }}/>
      <Tab.Screen name="Rutinas" component={GestionRutinas} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default function GestionScreenMonitor() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
