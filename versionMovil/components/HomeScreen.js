import React from 'react';
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

  const handleLogout = () => {
    // Aquí debes escribir la lógica para el logout
  };

  return (
    
    <ImageBackground
      source={require('../assets/logo.png')}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>
          ¡Bienvenido a la aplicación del gimnasio!
        </Text>
        <View style={styles.buttons}>
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Ejercicios')}>
              <Ionicons name="fitness-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver ejercicios</Text>
            </TouchableOpacity>
          </Animated.View>
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
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Maquinas')}>
              <Ionicons name="barbell-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Máquinas</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Friends')}>
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Amigos</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={{
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Ranking')}>
              <Ionicons name="trophy-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Ranking</Text>
            </TouchableOpacity>
          </Animated.View>
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
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  buttons: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 60,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#ff7f50',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

// Exporta el componente HomeScreen
export default HomeScreen;