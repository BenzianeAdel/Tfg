import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegistroScreen from './components/RegistroScreen';
import HomeScreen from './components/HomeScreen';
import MiPerfil from './components/MiPerfil';
import Servicios from './components/Servicios';
import Friends from './components/Friends';
import ActivitiesScreen from './components/ActivitiesScreen';
import Ranking from './components/Ranking';
import Ejercicios from './components/Ejercicios';
import Reserva from './components/Reserva';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from './components/ChatScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import LesionesScreen from './components/LesionesScreen';
import GestionScreenMonitor from './components/GestionScreenMonitor';
import NewRutina from './components/NewRutina';
import NewActividad from './components/NewActividad';
import GestionScreenAdmin from './components/GestionScreenAdmin';
import GestionUsers from './components/GestionUsers';
import NewMaquina from './components/NewMaquina';
import NewUser from './components/NewUser';
import EditarActividad from './components/EditarActividad';
import EditarMaquina from './components/EditarMaquina';
import EditarRutina from './components/EditarRutina';

const Stack = createStackNavigator();
const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem('userData');
    await fetch('http://192.168.1.234:8080/logoutMovil');
  } catch (error) {
    console.log('Error al eliminar la información del usuario de AsyncStorage: ', error);
  }
};
async function handleLogout (navigation) {
  removeUserInfo();
  navigation.navigate('Inicio Sesion');
};
export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Inicio Sesion">
    <Stack.Screen 
  name="Home" 
  component={HomeScreen} 
  options={({ navigation }) => ({
    headerTitle: "Home",
    headerLeft: false,
    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 10,marginBottom:-10 }} onPress={()=>handleLogout(navigation)}>
        <Ionicons name="exit-outline" size={30} color="black" />
      </TouchableOpacity>
    ),
  })}
/>
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Inicio Sesion" component={LoginScreen} />
      <Stack.Screen name="MiPerfil" component={MiPerfil} />
      <Stack.Screen name="Servicios" component={Servicios} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen name="Amigos" component={Ranking} />
      <Stack.Screen name="Ejercicios" component={Ejercicios} />
      <Stack.Screen name="Reserva" component={Reserva} />
      <Stack.Screen name="Lista Actividades" component={ActivitiesScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Restablecer Contraseña" component={ForgotPasswordScreen} />
      <Stack.Screen name="Listado de Lesiones" component={LesionesScreen} />
      <Stack.Screen name="Gestion Ejercicios" component={GestionScreenMonitor} />
      <Stack.Screen name="Gestion Maquinas" component={GestionScreenAdmin} />
      <Stack.Screen name="Gestion Usuarios" component={GestionUsers} />
      <Stack.Screen name="Nueva Rutina" component={NewRutina} />
      <Stack.Screen name="Nueva Maquina" component={NewMaquina} />
      <Stack.Screen name="Nueva Actividad" component={NewActividad} />
      <Stack.Screen name="Editar Actividad" component={EditarActividad} />
      <Stack.Screen name="Editar Maquina" component={EditarMaquina} />
      <Stack.Screen name="Editar Rutina" component={EditarRutina} />
      <Stack.Screen name="Nuevo Usuario" component={NewUser} />
    </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
