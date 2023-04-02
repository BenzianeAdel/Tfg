import React, { useState, useEffect} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IP from '../config';

const MiPerfil = () => {
  const [userData, setUserData] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        setUserData(userData);
        setEmail(userData.email);
        setNombre(userData.nombre);
        setApellidos(userData.apellidos);
        setPassword(userData.password);
      } catch (error) {
        console.log(error);
      }
    };
    loadUserData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };
  const handleSave = async () => {
    if (!email || !password || !nombre || !apellidos) {
      setErrorMessage('Por favor ingrese un correo electrónico, nombre, apellidos y contraseña.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor ingrese un correo electrónico válido.');
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo al menos un número, una letra mayúscula y una letra minúscula.');
      return;
    }
    try {
      const newUserData = {
        id: userData.id,
        eMail: email,
        password: password,
        nombre: nombre,
        apellidos: apellidos
      };
      console.log(newUserData)
      const response = await fetch(`http://${IP}/perfil/editar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData)
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        await AsyncStorage.setItem('userData',JSON.stringify(data));
      }
      const userDataString = await AsyncStorage.getItem('userData');
      const newUserDataResponse = JSON.parse(userDataString);
      setUserData(newUserDataResponse);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          {editing ? (
            <TouchableOpacity style={styles.editButton} onPress={handleSave}>
              <FontAwesome name="check-circle" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <FontAwesome name="edit" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.error}>
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={20} color="#FF6F6F" style={styles.errorIcon} />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                onChangeText={setNombre}
                value={nombre}
              />
            ) : (
              <Text style={styles.value}>{nombre}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Apellidos</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                onChangeText={setApellidos}
                value={apellidos}
              />
            ) : (
              <Text style={styles.value}>{apellidos}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Correo electrónico</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
                editable={false}
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            {editing ? (
              <TextInput
                style={styles.input}
                autoCapitalize="words"
                onChangeText={setPassword}
                secureTextEntry={true}
                value={password}
              />
            ) : (
              <Text style={styles.value}>{password}</Text>
            )}
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor:'#6B3654',
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
    },
    editButton: {
      marginLeft: 10,
      backgroundColor: '#5cb85c',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    content: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      marginLeft: 20,
      marginRight: 20,
    },
    field: {
      marginBottom: 20,
    },
    label: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#444',
    },
    value: {
      fontSize: 18,
      color: '#555',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      fontSize: 18,
      color: '#555',
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
    error:{
      marginLeft:10,
      marginRight: 10,
      marginBottom:10,
    },
    errorMessage: {
      color: '#FF6F6F',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  export default MiPerfil;