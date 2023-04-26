import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-elements';
import Modal from 'react-native-modal';
import { FontAwesome } from '@expo/vector-icons';
import IP from '../config';

const GestionUsers = ({navigation}) => {
    const [usuarios, setUsuarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [nombre,setNombre] = useState('');
    const [apellidos,setApellidos] = useState('');
    const [password,setPassword] = useState('');
    const [email,setEmail] = useState('');
    const [activo,setActivo] = useState(false);
    const [busqueda, setBusqueda] = useState('');

  const cargarUsuarios = () => {
    fetch(`http://${IP}/usuariosMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error(error));
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    cargarUsuarios();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarUsuarios();
    });
    return unsubscribe;
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    return usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });
  const handleCheck = () => {
    setActivo(!activo);
  };
  const editarUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    toggleModal();
  };
  async function guardarCambios() {
    if (!nombre || !apellidos || !password || !email) {
      alert('Por favor, complete todos los campos');
      return;
    }
    try {
      const requestData = {
            id: id,
            nombre: nombre,
            apellidos: apellidos,
            password: password,
            eMail: email,
            acceso: activo
      };
      const respuesta = await fetch(`http://${IP}/usuarioEditarMovil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (respuesta.ok) {
        cargarUsuarios();
        closeModal(); // Cerrar el modal después de guardar la enfermedad
      } else {
        alert('Por favor, el correo introducido ya existe en el sistema, introduce otro');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    
    <ScrollView style={styles.containerR}>
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.busquedaInput}
          placeholder="Buscar"
          value={busqueda}
          onChangeText={texto => setBusqueda(texto)}
        />
      </View>
      {usuariosFiltrados.map(usuario => (
        <TouchableOpacity key={usuario.id.toString()} onPress={() => editarUsuario(usuario)}>
        <View key={usuario.id} style={styles.usuarioContainerR}>
          <Avatar
          size="medium"
          rounded
          title={usuario.nombre.substring(0, 2).toUpperCase()}
          containerStyle={styles.avatar}
          />
          <View style={styles.infoContainerR}>
            <Text style={styles.nombreUsuario}>{usuario.nombre} ({usuario.tipoUser})</Text>
            <Text style={styles.emailUsuario}>{usuario.email}</Text>
          </View>
          <TouchableOpacity style={styles.enviarButton} onPress={() => editarUsuario(usuario)}>
            <Icon name='edit' type='font-awesome-5' color='black' size={16} />
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
            <Text style={styles.title}> Editar Perfil Usuario</Text>
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                placeholder="Correo Electrónico"
                value={selectedUsuario?.email}
            />
            <TextInput
                style={styles.input}
                onChangeText={setApellidos}
                placeholder="Apellidos"
                value={selectedUsuario?.apellidos}
            />
            <TextInput
                style={styles.input}
                onChangeText={setNombre}
                placeholder="Nombre"
                value={selectedUsuario?.nombre}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                placeholder="Contraseña"
                value={selectedUsuario?.password}
            />
            <CheckBox
                title='Permitir acceso'
                checked={selectedUsuario?.acceso}
                onPress={handleCheck}
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios}>
            <Text style={styles.textoBotonGuardar}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={toggleModal}>
            <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
        </View>
        </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    busquedaContainer: {
        padding: 10,
        backgroundColor: '#6B3654',
    },
    title: {
        fontSize: 24,
        flexDirection: 'row',
        alignItems: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    busquedaInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
    },
    avatar: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFDC00',
    },
    nombreUsuario: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    emailUsuario: {
        fontSize: 14,
        color: '#555',
    },
    enviarButton: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: '#61E5FF',
       borderRadius: 10,
       padding: 5,
    },
    enviarText: {
        fontSize: 14,
        color: '#fff',
    },
    containerR: {
        flex: 1,
        padding: 10,
        backgroundColor: '#6B3654',
        paddingBottom: 200,
    },
    usuarioContainerR: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#FFCC99',
    },
    usuarioContainerAltR: {
        backgroundColor: '#f1f1f1',
        paddingBottom: 100,
    },
    infoContainerR: {
        flex: 1,
        marginLeft: 10,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        margin: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    botonGuardar: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    textoBotonGuardar: {
        color: 'white',
        fontWeight: 'bold',
    },
    botonCancelar: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    textoBotonCancelar: {
        color: 'white',
        fontWeight: 'bold',
    },
  });
  export default GestionUsers;