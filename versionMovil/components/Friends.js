import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import IP from '../config';
const Tab = createBottomTabNavigator();

function BuscarContactosScreen({navigation}){
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const cargarUsuarios = () => {
    fetch(`http://${IP}/mensajesMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error(error));
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

  const enviarMensaje = (nombre,id) => {
    navigation.navigate('ChatScreen', { userName: nombre, iduserName: id});
  };

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
        <TouchableOpacity key={usuario.id.toString()} onPress={() => enviarMensaje(usuario.nombre,usuario.id)}>
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
          <TouchableOpacity style={styles.enviarButton} onPress={() => enviarMensaje(usuario.nombre,usuario.id)}>
            <Icon name='envelope' type='font-awesome-5' color='#FFDC00' size={16} />
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
function MensajesRecientesScreen({navigation}){
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const cargarUsuarios = () => {
    fetch(`http://${IP}/mensajesRecientesMovil`)
      .then(respuesta => respuesta.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error(error));
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

  const enviarMensaje = (nombre,id) => {
    navigation.navigate('ChatScreen', { userName: nombre, iduserName: id});
  };

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
        <TouchableOpacity key={usuario.id.toString()} onPress={() => enviarMensaje(usuario.nombre,usuario.id)}>
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
          <TouchableOpacity style={styles.enviarButton} onPress={() => enviarMensaje(usuario.nombre,usuario.id)}>
            <Icon name='envelope' type='font-awesome-5' color='#FFDC00' size={16} />
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  busquedaContainer: {
    padding: 10,
    backgroundColor: '#6B3654',
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

          if (route.name === 'Mensajes recientes') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'Buscar Contactos') {
            iconName = focused ? 'account-search' : 'account-search-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Mensajes recientes" component={MensajesRecientesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Buscar Contactos" component={BuscarContactosScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default function Friends() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
