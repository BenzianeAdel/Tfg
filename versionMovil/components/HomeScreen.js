import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const HomeScreen = ({ navigation }) => {
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonScale = React.useRef(new Animated.Value(0)).current;
  const [rol, setRol] = useState('');
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    async function fetchRol() {
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setRol(userData.tipoUser);
    }
    fetchRol();
  }, []);

  const renderWelcomeMessage = () => {
    let message = '';
    let icon = '';
    let backgroundColor = '';

    if (rol === 'cliente') {
      message = '¡Bienvenido! cliente';
      icon = 'person-outline';
      backgroundColor = '#6B3654';
    } else if (rol === 'monitor') {
      message = '¡Hola! monitor';
      icon = 'ios-cog-outline';
      backgroundColor = '#F2BB05';
    } else if (rol === 'admin') {
      message = '¡Hola! administrador';
      icon = 'medkit-outline';
      backgroundColor = '#1C7F57';
    }

    return (
      <View style={styles.welcomeMessageContainer}>
        <Ionicons name={icon} size={32} color="black" />
        <Text style={styles.welcomeMessageText}>{message}</Text>
      </View>
    );
  };

  return (
    
    <ImageBackground
      source={require('../assets/logo01.png')}
      style={styles.background}>
      <View style={styles.container}>
      {renderWelcomeMessage()}
        <View style={styles.buttons}>
          {rol == 'monitor' &&(
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Gestion Ejercicios')}>
              <Ionicons name="settings" size={24} color="white" />
              <Text style={styles.buttonText}>Ejercicios</Text>
            </TouchableOpacity>
          </Animated.View>
          )}
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Ejercicios')}>
              <Ionicons name="fitness" size={24} color="white" />
              <Text style={styles.buttonText}>Ver ejercicios</Text>
            </TouchableOpacity>
          </Animated.View>
          {rol == 'admin' &&(
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Gestion Usuarios')}>
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.buttonText}>Usuarios</Text>
            </TouchableOpacity>
          </Animated.View>
          )}
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MiPerfil')}>
              <Ionicons name="person-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Mi perfil</Text>
            </TouchableOpacity>
          </Animated.View>
          {rol == 'admin' &&(
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Gestion Maquinas')}>
              <Ionicons name="settings" size={24} color="white" />
              <Text style={styles.buttonText}>Maquinas</Text>
            </TouchableOpacity>
          </Animated.View>
          )}
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Servicios')}>
              <Ionicons name="ios-cog-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Servicios</Text>
            </TouchableOpacity>
          </Animated.View>
          {(rol == 'cliente' || rol == 'monitor') && (
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Friends')}>
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.buttonText}>Enviar Mensaje</Text>
            </TouchableOpacity>
          </Animated.View>
          )}
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Amigos')}>
              <Ionicons name="trophy-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Ranking</Text>
            </TouchableOpacity>
          </Animated.View>
          {rol == 'cliente' && (
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Listado de Lesiones')}>
              <Ionicons name="medkit-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Lesiones</Text>
            </TouchableOpacity>
          </Animated.View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
  },
  buttons: {
    justifyContent: 'center',
  },
  button: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#6B3654',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  welcomeMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE7E7',
    borderWidth: 1,
    borderColor: '#FF6F6F',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  welcomeMessageText: {
    color: '#FF6F6F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Exporta el componente HomeScreen
export default HomeScreen;