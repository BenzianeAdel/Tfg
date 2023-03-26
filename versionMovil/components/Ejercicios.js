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
import Modal from 'react-native-modal';
const Tab = createBottomTabNavigator();

function MisReservasScreen(){

}
function RutinasScreen({navigation}){
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRutinas() {
      try {
        const response = await fetch('http://192.168.1.129:8080/rutinasMovil');
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
    // Lógica para reservar la rutina con el id correspondiente
  };

  const renderRutina = ({ item }) => {
    return (
      <Card containerStyle={styles.rutinaContainer}>
        <View style={styles.rutinaCard}>
          <Text style={styles.rutinaNombre}>{item.nombre}</Text>
          <View style={styles.rutinaInfo}>
            <Text style={styles.rutinaPuntos}>Puntos: {item.puntos}</Text>
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
        const response = await fetch('http://192.168.1.129:8080/rutinasDestacadasMovil');
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
    // Lógica para reservar la rutina con el id correspondiente
  };

  const renderRutina = ({ item }) => {
    return (
      <Card containerStyle={styles.rutinaContainer}>
        <View style={styles.rutinaCard}>
          <Text style={styles.rutinaNombre}>{item.nombre}</Text>
          <View style={styles.rutinaInfo}>
            <Text style={styles.rutinaPuntos}>Puntos: {item.puntos}</Text>
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
    container: {
      flex: 1,
      backgroundColor: '#F3E218',
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
      <View style={{ flex: 1,backgroundColor:'#f2c94c'}}>
        <MyTabs />
      </View>
    );
  }