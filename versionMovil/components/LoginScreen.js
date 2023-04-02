import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../config';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleForgotPassword = () => {
    navigation.navigate('Restablecer Contraseña');
  };
  const handleRegister = () => {
    navigation.navigate('Registro');
  };
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Por favor ingrese un correo electrónico y una contraseña.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      setErrorMessage('Por favor ingrese un correo electrónico válido.');
      return;
    }
    try {
      const requestData = {
        eMail: username,
        password: password
      };

      const response = await fetch(`http://${IP}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      if(response.ok){
        // procesar la respuesta storedData devuelve el objeto entero en json
        const data = await response.json();
        await AsyncStorage.setItem('userData',JSON.stringify(data));
        navigation.navigate('Home');
        //const storedData = await AsyncStorage.getItem('userData');
        //console.log(storedData);

        /**
         * Conseguir un atributo en concreto
         * // procesar la respuesta
        const data = await response.json();
        await AsyncStorage.setItem('userData',JSON.stringify(data));
        const storedData = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(storedData);
        console.log(userData.email);
         */
      }
      else{
        // Si la respuesta es un error, analiza el objeto JSON recibido y actualiza el estado de la aplicación con el mensaje de error
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
      
      <View style={styles.container}>
        <View style={{ alignItems: 'center', marginBottom: 50 }}>

        <Image style={{
            width: 300,
            height: 200,
            borderRadius: 40,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }} source={require('../assets/logo0.png')}/>
        </View>
        <View style={styles.form}>
          {errorMessage && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={20} color="#FF6F6F" style={styles.errorIcon} />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          )}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Correo electrónico"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            placeholder="Contraseña"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordButtonText}>¿Olvidó su contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>¿No tiene una cuenta? Regístrese</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFCC99'
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
  },
  form: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  button: {
    height: 40,
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
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 5,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  forgotPasswordButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
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
  errorIcon: {
    marginRight: 5,
  },
  errorMessage: {
    color: '#FF6F6F',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
