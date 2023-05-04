import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import IP from '../config';

const EditarRutina = ({navigation, route}) => {
    const { rutina } = route.params;
    const [nombre,setNombre] = useState(rutina.nombre);
    const [id,setId] = useState(rutina.id);
    const [errorMessage, setErrorMessage] = useState(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEjercicios, setSelectedEjercicios] = useState([]);
    const [selectedEjerciciosAntiguos, setSelectedEjerciciosAntiguos] = useState([]);

    useEffect(() => {
      fetch(`http://${IP}/actividadesMovil`)
          .then(response => response.json())
          .then(data => {
              const mappedData = data.map(item => ({
                  value: item.creador != null ? item.nombre + " (by " + item.creador.email + ")" : item.nombre + ' (by Unknown)',
                  key: item.id
              }));
              setEjercicios(mappedData);
              setSelectedEjerciciosAntiguos(rutina.actividades.map(item => item.id));
          })
          .catch(error => console.error(error));
  }, []);

    async function guardarRutina() {
        if (!nombre) {
          setErrorMessage('Por favor ingresa un nombre de rutina.');
          return;
        }
        var ejercicios=selectedEjerciciosAntiguos;
        if(selectedEjercicios.length != 0){
          ejercicios = selectedEjercicios;
        }
        try {
          const requestData = {
            id : id,
            nombre: nombre,
            actividades: ejercicios
          };
          const respuesta = await fetch(`http://${IP}/rutinasMovil/editar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
          });
          if (respuesta.ok) {
            navigation.navigate('Gestion Ejercicios');
            alert("La rutina se ha modificado correctamente");
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
                  setSelected={setSelectedEjercicios} 
                  data={ejercicios}
                  label="Ejercicios"
                  searchPlaceholder='Buscar Ejercicios'
                  labelStyles={{color:'black'}}
                  badgeStyles={{backgroundColor:'black'}}
                  boxStyles={{backgroundColor:'white',color:'black'}}
                  dropdownStyles={{backgroundColor:'white',color:'black'}}
                  checkBoxStyles={{backgroundColor:'white'}}
                  save="key"
                  defaultOption={{key: '1', value: 'Pectoral medio (by juangomez@gmail.com)'}}
                  keyExtractor={(item) => item.key.toString()}
              />
            </View>
            <Text style={{marginTop: 10,color:'white',fontWeight:'bold'}}>* Si se selecciona ejercicios nuevos. Los antiguos serán eliminados. *</Text>
              <TouchableOpacity style={styles.crearButton} onPress={() =>guardarRutina()}>
                <Text style={styles.buttonText}><Icon name='edit' type='font-awesome-5' color='#fff' size={16} /> Guardar Cambios</Text>
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
    backgroundColor: 'blue',
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

export default EditarRutina;
