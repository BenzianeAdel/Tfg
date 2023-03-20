import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/logo.png')} style={styles.background}>

      <View style={styles.container}>
        <Text style={styles.title}>¡Bienvenido a la aplicación del gimnasio!</Text>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Ejercicios')}>
            <Text style={styles.buttonText}>Ver ejercicios</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MiPerfil')}>
            <Text style={styles.buttonText}>Mi perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Maquinas')}>
            <Text style={styles.buttonText}>Ver Maquinas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Friends')}>
            <Text style={styles.buttonText}>Ver Amigos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Ranking')}>
            <Text style={styles.buttonText}>Ver Ranking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

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
    height: 40,
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

export default HomeScreen;
