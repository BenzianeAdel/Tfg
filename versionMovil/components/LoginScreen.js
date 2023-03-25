import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleForgotPassword = () => {
    // Agrega el código para manejar el evento de "Olvidó su contraseña"
    console.log('Olvidó su contraseña');
    navigation.navigate('Home');
  };
  const handleRegister = () => {
    navigation.navigate('Registro');
    // Agrega el código para manejar el evento de "Registrarse"
    console.log('Registrarse');
  };
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('Por favor ingrese un nombre de usuario y una contraseña.');
      return;
    }
    try {
      const requestData = {
        eMail: username,
        password: password
      };

      const response = await fetch('http://192.168.43.18:8080/login', {
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
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name="account-circle" size={50} color="#fff" />
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 , color:'black'}}>
        Bienvenido de nuevo
        </Text>
        </View>
        <View style={styles.form}>
          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder="Nombre de usuario"
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
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#ff7f50',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 5,
  },
  registerButtonText: {
    color: 'blue',
  },
  forgotPasswordButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  forgotPasswordButtonText: {
    color: 'blue',
  },
});

export default LoginScreen;
