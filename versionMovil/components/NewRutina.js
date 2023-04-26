import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import IP from '../config';

const NewRutina = ({navigation}) => {
    const [nombre,setNombre] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEjercicios, setSelectedEjercicios] = useState([]);

    useEffect(() => {
        fetch(`http://${IP}/actividadesMovil`)
          .then(response => response.json())
          .then(data => {
            const mappedData = data.map(item => ({
              value: item.nombre,
              key: item.id
            }));
            setEjercicios(mappedData);
          })
          .catch(error => console.error(error));
    }, []);

    async function crearRutina() {
        if (!nombre || selectedEjercicios.length === 0) {
          setErrorMessage('Por favor ingresa un nombre de rutina y selecciona al menos un ejercicio.');
          return;
        }
        try {
          const requestData = {
            nombre: nombre,
            actividades: selectedEjercicios
          };
          const respuesta = await fetch(`http://${IP}/crearRutinaMovil`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
          });
          if (respuesta.ok) {
            navigation.navigate('Gestion Ejercicios');
            alert("La rutina se ha creado correctamente");
          } else {
            console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
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
            <TextInput
              style={styles.input}
              placeholder="Introduce nombre de la rutina"
              autoCapitalize="words"
              value={nombre}
              onChangeText={setNombre}
            />
            <View>
            <MultipleSelectList
                  setSelected={(val)=> setSelectedEjercicios(val)}
                  data={ejercicios}
                  label="Ejercicios"
                  searchPlaceholder='Buscar Ejercicios'
                  labelStyles={{color:'black'}}
                  badgeStyles={{backgroundColor:'black'}}
                  boxStyles={{backgroundColor:'white',color:'black'}}
                  dropdownStyles={{backgroundColor:'white',color:'black'}}
                  checkBoxStyles={{backgroundColor:'white'}}
                  save="key"
              />
            </View>
            
              <TouchableOpacity style={styles.crearButton} onPress={() => crearRutina()}>
                <Text style={styles.buttonText}><Icon name='plus' type='font-awesome-5' color='#fff' size={16} /> Crear Rutina</Text>
              </TouchableOpacity>
        </ScrollView>
      );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6B3654',
  },
  selector: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFCC99'
  },
  calendar: {
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 20,
    backgroundColor:'#FFCC99',
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'red',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#FFCC99',
    borderRadius: 5,
    padding: 10,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 16,
    color: 'red',
  },
  crearButton: {
    backgroundColor: '#FF2A2A',
    alignItems:'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 50
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewRutina;
