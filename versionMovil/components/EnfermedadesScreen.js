import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TextInput, FlatList, TouchableOpacity } from 'react-native';
import IP from '../config';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

const EnfermedadesScreen = () => {
  const [enfermedades, setEnfermedades] = useState([]);
  const [estadoActualizado, setEstadoActualizado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [zonas,setZonas] = useState([]);
  const [selectedZona, setSelectedZona] = useState(null);
  const [lesion,setlesion] = useState('');

  useEffect(() => {
    async function fetchEnfermedades() {
      try {
        const response = await fetch(`http://${IP}/enfermedadesMovil`);
        const data = await response.json();
        setEnfermedades(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchEnfermedades();
  }, [estadoActualizado]);

  useEffect(() => {
    fetch(`http://${IP}/zonasCuerpoMovil`)
      .then(response => response.json())
      .then(data => setZonas(data))
      .catch(error => console.error(error));
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  async function anyadirEnfermedad() {
    setModalVisible(true);
  }

  // Función para eliminar una enfermedad
  async function eliminarEnfermedad(id){
    try {
        const respuesta = await fetch(`http://${IP}/enfermedadesMovil/${id}/borrar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Puedes agregar aquí el token de autenticación si es necesario
        });
        if (respuesta.ok) {
            setEstadoActualizado(!estadoActualizado);
        } else {
          console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
        }
      } catch (error) {
        console.error(error);
      }
    setEnfermedades(enfermedades.filter(enfermedad => enfermedad.id !== id));
  }
  async function guardarEnfermedad() {
    // Validar que se hayan ingresado los datos necesarios (lesión y zona)
    if (lesion === '' || !selectedZona) {
      alert('Por favor, complete todos los campos');
      return;
    }
  
    try {
      const requestData = {
            lesion: lesion,
            zonaEvitar: selectedZona
      };
      const respuesta = await fetch(`http://${IP}/enfermedadesMovil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (respuesta.ok) {
        setEstadoActualizado(!estadoActualizado);
        closeModal(); // Cerrar el modal después de guardar la enfermedad
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.botonCrear} onPress={() => anyadirEnfermedad()}>
        <Text style={styles.textoBotonCrear}>Añadir Enfermedad</Text>
      </TouchableOpacity>
      <FlatList
        data={enfermedades}
        renderItem={({ item }) => (
          <View style={styles.enfermedadItem}>
            <View style={styles.infoContainerR}>
                <Text style={styles.lesionContainer}>{item.lesion}</Text>
                <Text style={styles.zonaContainer}>{item.zonaEvitar}</Text>
            </View>
            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() => eliminarEnfermedad(item.id)}
            >
              <Icon name='trash' type='font-awesome-5' color='#FFDC00' size={16} />
              <Text style={styles.textoBotonEliminar}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
        <Modal visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
            <TextInput
                style={styles.input}
                onChangeText={setlesion}
                placeholder="Lesión"
                value={lesion}
            />
            <Picker
            style={styles.picker}
            selectedValue={selectedZona}
            onValueChange={itemValue => setSelectedZona(itemValue)}
          >
            <Picker.Item label="Seleccione una zona" value={null} />
            {zonas.map(zona => (
              <Picker.Item label={zona} value={zona} key={zona} />
            ))}
          </Picker>
            <TouchableOpacity style={styles.botonGuardar} onPress={guardarEnfermedad}>
            <Text style={styles.textoBotonGuardar}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={closeModal}>
            <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
        </View>
        </Modal>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6B3654',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  enfermedadItem: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#FFCC99',
  },
  enfermedadNombre: {
    flex: 1,
    fontSize: 18,
  },
  botonEliminar: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  textoBotonEliminar: {
    color: 'white',
    fontSize: 16,
  },
  botonCrear: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  textoBotonCrear: {
    color: 'white',
    fontSize: 18,
  },
  infoContainerR: {
    flex: 1,
    marginLeft: 10,
  },
  lesionContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  zonaContainer: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  botonGuardar: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotonGuardar: {
    color: 'white',
    fontWeight: 'bold',
  },
  botonCancelar: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBotonCancelar: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EnfermedadesScreen;