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

  return (
    
    <ImageBackground
      source={require('../assets/logo01.png')}
      style={styles.background}>
      <View style={styles.container}>
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
              onPress={() => navigation.navigate('Servicios')}>
              <Ionicons name="ios-cog-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Ver Servicios</Text>
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
              <Text style={styles.buttonText}>Enviar Mensaje</Text>
            </TouchableOpacity>
          </Animated.View>
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
});

// Exporta el componente HomeScreen
export default HomeScreen;