import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import IP from '../config';

const NewActividad = ({navigation}) => {
    const [nombre,setNombre] = useState('');
    const [repeticiones,setRepeticiones] = useState(1);
    const [series,setSeries] = useState(1);
    const [maquinas, setMaquinas] = useState([]);
    const [selectedMaquina, setSelectedMaquina] = useState(null);
    const [zonas,setZonas] = useState([]);
    const [selectedZona, setSelectedZona] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetch(`http://${IP}/maquinasSala`)
          .then(response => response.json())
          .then(data => setMaquinas(data))
          .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`http://${IP}/zonasCuerpoMovil`)
          .then(response => response.json())
          .then(data => setZonas(data))
          .catch(error => console.error(error));
    }, []);

    async function crearActividad() {
        if (!nombre || !selectedZona || !series || !repeticiones) {
          setErrorMessage('Por favor ingrese un nombre de la actividad, series, repeticiones, zona del cuerpo.');
          return;
        }
        if(repeticiones<1 || series<1){
            setErrorMessage('Las repeticiones o series deben ser iguales o superior a 1.');
            return;
        }
        const repeticionesNumero = parseInt(repeticiones, 10);
        const seriesNumero = parseInt(series, 10);
        // Verificar si los valores son números enteros
        if (isNaN(repeticionesNumero) || isNaN(seriesNumero) || repeticionesNumero % 1 !== 0 || seriesNumero % 1 !== 0) {
        setErrorMessage('Las repeticiones o series deben ser números enteros');
        return;
        }
        try {
          const requestData = {
            nombre: nombre,
            maquina: selectedMaquina,
            repeticiones: repeticiones,
            series: series,
            zonaCuerpo: selectedZona
          };
          console.log(requestData);
          const respuesta = await fetch(`http://${IP}/crearActividadMovil`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
          });
          if (respuesta.ok) {
            navigation.navigate('Gestion Ejercicios');
            alert("La actividad se ha creado correctamente");
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
              placeholder="Introduce nombre de la actividad"
              autoCapitalize="words"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Introduce numero de series"
              keyboardType="numeric"
              value={series.toString()}
              onChangeText={setSeries}
            />
            <TextInput
              style={styles.input}
              placeholder="Introduce numero de repeticiones"
              keyboardType="numeric"
              value={repeticiones.toString()}
              onChangeText={setRepeticiones}
            />
            <View style={styles.selector}>
                <Picker
                    selectedValue={selectedZona}
                    onValueChange={itemValue => setSelectedZona(itemValue)}
                >
                    <Picker.Item label="Seleccione una zona" value={null} />
                    {zonas.map(zona => (
                    <Picker.Item label={zona} value={zona} key={zona} />
                    ))}
                </Picker>
            </View>
            <View style={styles.selector}>
              <Picker
                selectedValue={selectedMaquina}
                onValueChange={(itemValue, itemIndex) => setSelectedMaquina(itemValue)}
              >
                <Picker.Item label="Selecciona una Maquina" value={null} />
                {maquinas.map(maquina => (
                  <Picker.Item label={maquina.nombre} value={maquina} key={maquina.id} />
                ))}
              </Picker>
            </View>
              <TouchableOpacity style={styles.crearButton} onPress={() => crearActividad()}>
                <Text style={styles.buttonText}><Icon name='plus' type='font-awesome-5' color='#fff' size={16} /> Crear Actividad</Text>
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
    backgroundColor: '#FFCC99',
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

export default NewActividad;
