import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Avatar, Icon } from 'react-native-elements';
import {Alert} from 'react-native'
import  { map , size, filter } from 'lodash';
import IP from '../config';
import { loadImageFromGallery } from './util';

function UploadImage({imagesSelected,setImagesSelected}){
  const imageSelect = async()=>{
    const response = await loadImageFromGallery([4,3])
    if(!response.status){
      return
    }
    setImagesSelected([...imagesSelected,response.image])
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
            setImagesSelected(
              filter(imagesSelected,(imageUrl)=> imageUrl !==image)
            )
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
     style={styles.viewImages}
    >
      {
        size(imagesSelected)<10 && (
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
        map(imagesSelected, (imageActividad,index) => {
          return (
            <Avatar
              key={index}
              style={styles.miniaturesStyle}
              source={{uri: imageActividad[0].uri}}
              onPress={()=> removeImage(imageActividad)}
            />
          );
        })
      }
    </ScrollView>
  )
}
const EditarActividad = ({navigation, route}) => {
    const { actividad } = route.params;
    const [nombre,setNombre] = useState(actividad.nombre);
    const [id,setId] = useState(actividad.id);
    const [repeticiones,setRepeticiones] = useState(actividad.repeticiones);
    const [series,setSeries] = useState(actividad.series);
    const [maquinas, setMaquinas] = useState([]);
    const [selectedMaquina, setSelectedMaquina] = useState(actividad.maquina);
    const [zonas,setZonas] = useState([]);
    const [selectedZona, setSelectedZona] = useState(actividad.zonaCuerpo);
    const [errorMessage, setErrorMessage] = useState(null);
    const [imagesSelected, setImagesSelected]= useState([]);

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

    async function guardarActividad() {
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
          const formData = new FormData();
          const requestData = {
            id: id,
            nombre: nombre,
            maquina: selectedMaquina,
            repeticiones: repeticiones,
            series: series,
            zonaCuerpo: selectedZona
          }
          const now = new Date();
          const randomNumber = Math.floor(now.getTime() * Math.random());
          formData.append('data', JSON.stringify(requestData));
          for (let i = 0; i < imagesSelected.length; i++) {
              const image = imagesSelected[i][0];
              formData.append('images', {
                  uri: image.uri,
                  name: 'image'+i + randomNumber +'.jpg',
                  type: 'image/jpeg'
              });
          }
          const response = await fetch(`http://${IP}/actividadesMovil/editar`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
              body: formData
          });
          if (response.ok) {
            navigation.navigate('Gestion Ejercicios');
            alert("La actividad se ha modificado correctamente");
          } else {
            console.error(`Error ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error(error);
        }
    }
    const handleMaquinaChange = (value) => {
      const maquinaSeleccionada = maquinas.find(maquina => maquina.id === value);
      setSelectedMaquina(maquinaSeleccionada);
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
               selectedValue={selectedMaquina?.id}
               onValueChange={handleMaquinaChange}>
                <Picker.Item label="--Selecciona una Maquina--" value={null} />
                {maquinas.map(maquina => (
                    <Picker.Item label={maquina.nombre} value={maquina.id} key={maquina.id}/>
                  ))}
              </Picker>
            </View>
            <UploadImage
              imagesSelected={imagesSelected}
              setImagesSelected={setImagesSelected}
            />
            <Text style={{marginTop: 10,color:'white',fontWeight:'bold'}}>Selecciona las imagenes para actualizar. Se eliminarán las imagenes anteriores.</Text>
              <TouchableOpacity style={styles.crearButton} onPress={() => guardarActividad()}>
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
  viewImages: {
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
  }
});

export default EditarActividad;
