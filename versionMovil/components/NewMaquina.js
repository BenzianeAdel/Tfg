import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, Button, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker  from '@react-native-community/datetimepicker';
import { Avatar, Icon } from 'react-native-elements';
import IP from '../config';
import  { filter } from 'lodash';
import { loadImageFromGallery } from './util';
import {Alert} from 'react-native'

function UploadImage({imageSelected,setImageSelected}){
  const imageSelect = async()=>{
    const response = await loadImageFromGallery([4,3])
    if(!response.status){
      return
    }
    setImageSelected(response.image)
  }
  const removeImage = (image) =>{
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro que quieres eliminar la imagen?",
      [
        {
          text: "No",
          style:"cancel"
        },
        {
          text: "Si",
          onPress: ()=>{
            setImageSelected(null)
          }
        }
      ],
      {
        canelable:true
      }
    )
  }
  return (
    <ScrollView
     horizontal
     style={styles.viewImage}
    >
      {
        imageSelected==null && (
          <Icon
          type="material-comunity"
          name="image"
          color="#000000"
          size={70}
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        ></Icon> 
        )    
      }
      {
        imageSelected != null && (
          <Avatar
              style={styles.miniaturesStyle}
              source={{uri: imageSelected[0].uri}}
              onPress={()=> removeImage(imageSelected)}
         />
        )
      }
      
    </ScrollView>
  )
}
const NewMaquina = ({navigation}) => {
    const [nombre,setNombre] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [registro, setRegistro] = useState(new Date());
    const [imageSelected, setImageSelected] = useState(null);


    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || registro;
        setShowPicker(Platform.OS === 'ios');
        setRegistro(currentDate);
    };
    const handleShowPicker = () => {
        setShowPicker(true);
    };

    async function crearMaquina() {
        if (!nombre || !registro) {
          setErrorMessage('Por favor ingresa un nombre de maquina y fecha de registro.');
          return;
        }
        try {
          const formData = new FormData();
          const requestData = {
            nombre: nombre,
            registro: registro
          };
          formData.append('data', JSON.stringify(requestData));
          const image = imageSelected[0];
          formData.append('imagen', {
                  uri: image.uri,
                  name: 'image'+'.jpg',
                  type: 'image/jpeg'
          });
          const respuesta = await fetch(`http://${IP}/maquinasMovil`, {
            method: 'POST',
            headers: {
                  'Content-Type': 'multipart/form-data'
            },
            body: formData
          });
          if (respuesta.ok) {
            navigation.navigate('Gestion Maquinas');
            alert("La maquina se ha creado correctamente");
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
            <Button onPress={handleShowPicker} title="Seleccionar fecha de registro"/>
            <Text style={{ marginLeft: 10, lineHeight: 40 , fontWeight: 'bold',color:'white'}}>
                {registro.toLocaleString()}
            </Text>
            {showPicker && (
            <DateTimePicker
                value={registro}
                mode={'date'}
                display="default"
                onChange={handleDateChange}
            />
            )}
            <UploadImage
              imageSelected={imageSelected}
              setImageSelected={setImageSelected}
            />
            </View>
              <TouchableOpacity style={styles.crearButton} onPress={() => crearMaquina()}>
                <Text style={styles.buttonText}><Icon name='plus' type='font-awesome-5' color='#fff' size={16} /> Crear Maquina</Text>
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
  viewImage: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
  },
  containerIcon:{
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width:70,
    backgroundColor: "#e3e3e3",
    borderRadius: 10,
    marginBottom: 10,
  },
  miniaturesStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 10,
  }
});

export default NewMaquina;
