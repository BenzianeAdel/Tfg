import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import DateTimePicker  from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
const RegistroScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthdate;
    setShowPicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
  };
  const handleShowPicker = () => {
    setShowPicker(true);
  };
  const handleSubmit = () => {
    const isoDate = birthdate.toISOString().slice(0, 10);
    console.log({
      name,
      email,
      password,
      birthdate: isoDate,
    });
  }
  
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
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 10 }}>
          Registro de Usuario
        </Text>
      </View>
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
            {birthdate.toLocaleDateString()}
          </Text>
        {showPicker && (
          <DateTimePicker
            value={birthdate}
            mode={'date'}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#f2c94c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RegistroScreen;
