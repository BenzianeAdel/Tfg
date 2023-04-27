import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Button, StyleSheet } from 'react-native';
import DateTimePicker  from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import IP from '../config';
const NewUser = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [tipos,setTipos] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [password, setPassword] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(`http://${IP}/tipoUsuariosMovil`)
      .then(response => response.json())
      .then(data => setTipos(data))
      .catch(error => console.error(error));
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowPicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
  };
  const handleShowPicker = () => {
    setShowPicker(true);
  };
  const handleSubmit = async () =>  {
    if (!email || !password || !name || !birthdate || !apellidos || !selectedTipo) {
      setErrorMessage('Por favor ingrese un correo electrónico, nombre, apellidos, fecha nacimiento, contraseña y rol de usuario.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor ingrese un correo electrónico válido.');
      return;
    }
    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo al menos un número, una letra mayúscula y una letra minúscula.');
      return;
    }
    try {
      const requestData = {
        eMail: email,
        password: password,
        nombre: name,
        apellidos: apellidos,
        fechaNacimiento: birthdate,
        user: selectedTipo
      };

      const response = await fetch(`http://${IP}/newUserMovil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      if(response.ok){
        const data = await response.json();
        alert(data.message);
        navigation.navigate('Gestion Usuarios');
      }
      else{
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <ScrollView style={styles.container}>
      {errorMessage && (
          <View style={styles.errorContainer}>
            <Icon name="error" size={20} color="#FF6F6F" style={styles.errorIcon} />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
      )}
      <View style={styles.formContainer}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Apellidos</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          autoCapitalize="words"
          value={apellidos}
          onChangeText={setApellidos}
        />
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Contraseña<TouchableOpacity style={styles.iconContainer} onPress={() => setHidePassword(!hidePassword)}>
              <Icon name={hidePassword ? 'visibility-off' : 'visibility'} size={18} color="#f2c94c" />
            </TouchableOpacity></Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
        />
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>Fecha Nacimiento</Text>
        <Button onPress={handleShowPicker} title="Seleccionar fecha de nacimiento"/>
        <Text style={{ marginLeft: 10, lineHeight: 40 , fontWeight: 'bold'}}>
          </Text>
        {showPicker && (
          <DateTimePicker
            value={birthdate}
            mode={'date'}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Picker
            style={styles.picker}
            selectedValue={selectedTipo}
            onValueChange={itemValue => setSelectedTipo(itemValue)}
          >
            <Picker.Item label="Seleccione un tipo" value={null} />
            {tipos.map(tipo => (
              <Picker.Item label={tipo} value={tipo} key={tipo} />
            ))}
          </Picker>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}><Icon name='add' type='font-awesome-5' color='#FFDC00' size={16} />Crear Usuario</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  inputPassword: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6B3654',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 30,
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    height: 40,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#6B3654',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
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
  picker: {
    height: 40,
    fontWeight: 'bold',
    backgroundColor: '#E1C5C5',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default NewUser;
