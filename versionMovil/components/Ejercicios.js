import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Button,FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { random } from 'lodash';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import Modal from 'react-native-modal';
const Tab = createBottomTabNavigator();

function MisActividadesScreen(){

}
function ActividadesScreen(){

}
function Destacados({ navigation }) {
    const [data, setData] = useState([]);
    const [selectedActividad, setSelectedActividad] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleReserva = (item) => {
        toggleModal();
        navigation.navigate('Reserva', { item: item });
    }
  
    useEffect(() => {
      fetch('http://192.168.43.18:8080/actividades/destacadas')
        .then((response) => response.json())
        .then((json) => {
          setData(json);
        })
        .catch((error) => console.error(error));
    }, []);
  
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => {setSelectedActividad(item);
            toggleModal();}}>
            <View style={styles.card}>
              <Image source={{ uri: `http://192.168.43.18:8080/img/${item.imagen}` }} style={styles.cardImage} />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <View style={styles.cardFooter}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome name="circle" size={18} color="#FAB81E" style={{ marginRight: 5 }} />
                    <Text style={styles.cardLikes}>Puntos: {item.puntos}</Text>
                  </View>
                </View>
              </View>
            </View>
        </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        <View style={styles.backgroundImage}>
          <View style={styles.content}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedActividad?.nombre}</Text>
                <Text style={styles.modalText}>Series: {selectedActividad?.series}</Text>
                <Text style={styles.modalText}>Repeticiones: {selectedActividad?.repeticiones}</Text>
                <Image style={styles.actividadImagenModal} source={{ uri: `http://192.168.43.18:8080/img/${selectedActividad?.imagen}` }} />
                <TouchableOpacity style={styles.reservarButton} onPress={() => handleReserva(selectedActividad?.id)}>
                    <FontAwesome name="calendar-plus-o" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Reservar</Text>
                </TouchableOpacity>
                </View>
                
            </Modal>
          </View>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3E218',
    },
    reservarButton: {
      backgroundColor: '#FAB81E',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },       
    actividadImagenModal: {
      width: 300,
      height: 300,
    },
    backgroundImage: {
      backgroundColor: '#f2c94c',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalText: {
        fontSize: 18,
    },
    content: {
      paddingVertical: 30,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 20,
      elevation: 2,
      width: '100%',
      height: 250,
    },
    cardImage: {
      width: '100%',
      height: '75%',
    },
    cardDetails: {
      padding: 10,
      height: '25%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: '#444',
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    cardPointsIcon: {
      marginRight: 5,
    },
    cardPointsText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#666',
    },
});

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Actividades') {
            iconName = focused ? 'weight-lifter' : 'weight-lifter';
          } else if (route.name === 'Mis Actividades') {
            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';
          } else if (route.name === 'Destacadas') {
            iconName = focused ? 'star' : 'star-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        tabStyle: { backgroundColor: '#fff' },
        labelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Actividades" component={ActividadesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Mis Actividades" component={MisActividadesScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Destacadas" component={Destacados} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

export default function Ejercicios({ navigation }) {
    return (
      <View style={{ flex: 1,backgroundColor:'#f2c94c'}}>
        <MyTabs />
      </View>
    );
  }