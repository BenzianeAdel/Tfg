import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegistroScreen from './components/RegistroScreen';
import HomeScreen from './components/HomeScreen';
import MiPerfil from './components/MiPerfil';
import Maquinas from './components/Maquinas';
import Friends from './components/Friends';
import Ranking from './components/Ranking';
import Ejercicios from './components/Ejercicios';
import Reserva from './components/Reserva';
import React from 'react';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Inicio Sesion">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="Inicio Sesion" component={LoginScreen} />
      <Stack.Screen name="MiPerfil" component={MiPerfil} />
      <Stack.Screen name="Maquinas" component={Maquinas} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen name="Ranking" component={Ranking} />
      <Stack.Screen name="Ejercicios" component={Ejercicios} />
      <Stack.Screen name="Reserva" component={Reserva} />
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
