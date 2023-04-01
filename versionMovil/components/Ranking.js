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
import { AsyncStorage } from 'react-native';
import IP from '../config';
const Tab = createBottomTabNavigator();

function BuscarAmigosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function obtenerUsuarios() {
      try {
        const respuesta = await fetch(`http://${IP}/usuarios`);
        const datos = await respuesta.json();
        setUsuarios(datos);
      } catch (error) {
        console.error(error);
      }
    }
    obtenerUsuarios();
  }, [usuarios]);
  function getRandomColor() {
    const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#ffee58', '#ffb74d', '#a1887f', '#90a4ae'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  async function seguirUsuario(usuarioId) {
    try {
      const respuesta = await fetch(`http://${IP}/amigosMovil/seguir/${usuarioId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        // Aquí puedes actualizar el estado para indicar que se siguió al usuario
        console.log(`Se siguió al usuario ${usuarioId}`);
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const usuariosFiltrados = usuarios.filter(usuario => {
    return usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

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
        <View key={usuario.id} style={styles.usuarioContainerR}>
          <Avatar
          size="medium"
          rounded
          title={usuario.nombre.substring(0, 2).toUpperCase()}
          containerStyle={styles.avatar}
          />
          <View style={styles.infoContainerR}>
            <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
            <Text style={styles.emailUsuario}>{usuario.email}</Text>
          </View>
          <TouchableOpacity style={styles.seguirButton} onPress={() => seguirUsuario(usuario.id)}>
            <Icon name='user-plus' type='font-awesome-5' color='#fff' size={14} />
            <Text style={styles.seguirText}>Seguir</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFCC99',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDC00',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
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
  seguirButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 10,
    padding: 5,
  },
  dejarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 5,
  },
  seguirText: {
    fontSize: 14,
    color: '#fff',
  },
  dejarText: {
    fontSize: 14,
    color: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  lista: {
    flex: 1,
  },
  listaContenido: {
    paddingTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#FFCC99',
    borderRadius: 10,
  },
  containerR: {
    padding: 20,
    backgroundColor: '#6B3654',
  },
  tituloR: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  usuarioContainerR: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#FFCC99',
  },
  usuarioContainerAltR: {
    backgroundColor: '#FFCC99',
  },
  avatarContainerR: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puntosR: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainerR: {
    flex: 1,
    marginLeft: 10,
  },
  nombreR: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emailR: {
    fontSize: 14,
    color: '#999',
  },
  iconoContainerR: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function MisAmigosScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    async function obtenerAmigos() {
      try {
        const respuesta = await fetch(`http://${IP}/misamigos`);
        const datos = await respuesta.json();
        setUsuarios(datos);
      } catch (error) {
        console.error(error);
      }
    }
    obtenerAmigos();
  }, [usuarios]);
  function getRandomColor() {
    const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#ffee58', '#ffb74d', '#a1887f', '#90a4ae'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  async function dejarSeguir(usuarioId) {
    try {
      const respuesta = await fetch(`http://${IP}/amigosMovil/dejar/${usuarioId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        // Aquí puedes actualizar el estado para indicar que se siguió al usuario
        console.log(`Se siguió al usuario ${usuarioId}`);
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const usuariosFiltrados = usuarios.filter(usuario => {
    return usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
  });

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
        <View key={usuario.id} style={styles.usuarioContainerR}>
          <Avatar
          size="medium"
          rounded
          title={usuario.nombre.substring(0, 2).toUpperCase()}
          containerStyle={styles.avatar}
          />
          <View style={styles.infoContainerR}>
            <Text style={styles.nombreUsuario}>{usuario.nombre}</Text>
            <Text style={styles.emailUsuario}>{usuario.email}</Text>
          </View>
          <TouchableOpacity style={styles.dejarButton} onPress={() => dejarSeguir(usuario.id)}>
            <Icon name='user-minus' type='font-awesome-5' color='#fff' size={14} />
            <Text style={styles.dejarText}>Dejar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

function RankingScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [id,setId] = useState(0);

  useEffect(() => {
    async function obtenerUsuarios() {
      try {
        const respuesta = await fetch(`http://${IP}/rankingAmigos`);
        const datos = await respuesta.json();
        setUsuarios(datos);
        const storedData = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        setId(userData.id);
      } catch (error) {
        console.error(error);
      }
    }
    obtenerUsuarios();
  }, [usuarios]);

  return (
    <ScrollView style={styles.containerR}>
      {usuarios.map((usuario, index) => (
        <Animatable.View key={usuario.id} style={[styles.usuarioContainerR, index % 2 !== 0 && styles.usuarioContainerAltR]} animation="fadeInUp" delay={index * 100}>
          <View style={styles.avatarContainerR}>
            <FontAwesome name="user-circle" size={40} color="#333" />
            <Text style={styles.puntosR}>{usuario.puntos} pts.</Text>
          </View>
          <View style={styles.infoContainerR}>
              {usuario.id == id ? (
              <Text style={styles.nombreR}>{usuario.nombre} (Tú)</Text>
               ) : (
              <Text style={styles.nombreR}>{usuario.nombre}</Text>
              )}
            <Text style={styles.emailR}>{usuario.email}</Text>
          </View>
          <View style={styles.iconoContainerR}>
            <FontAwesome name="trophy" size={30} color={index === 0 ? '#fdd835' : '#999'} />
          </View>
        </Animatable.View>
      ))}
    </ScrollView>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Buscar amigos') {
            iconName = focused ? 'account-search' : 'account-search-outline';
          } else if (route.name === 'Mis amigos') {
            iconName = focused ? 'account-group' : 'account-group-outline';
          } else if (route.name === 'Ranking de puntos') {
            iconName = focused ? 'trophy' : 'trophy-outline';
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
      <Tab.Screen name="Buscar amigos" component={BuscarAmigosScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Mis amigos" component={MisAmigosScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Ranking de puntos" component={RankingScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}


export default function Ranking() {
  return (
    <View style={{ flex: 1,backgroundColor:'#F3E218'}}>
      <MyTabs />
    </View>
  );
}
