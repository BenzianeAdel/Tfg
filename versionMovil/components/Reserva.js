import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Button,FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
const Stack = createStackNavigator();
import { Calendar } from 'react-native-calendars';
import IP from '../config';

export default function Reserva({ navigation, route }) {
  const timeOptions = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
    ];
    const { rutinaID } = route.params;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
    const [monitores, setMonitores] = useState([]);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [titulo,settitulo] = useState('');
    const [reservas, setReservas] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    

  useEffect(() => {
    fetch(`http://${IP}/monitores`)
      .then(response => response.json())
      .then(data => setMonitores(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMonitor) {
        fetch(`http://${IP}/monitores/${selectedMonitor}/reservas`)
            .then(response => response.json())
            .then(data => setReservas(data))
            .catch(error => console.error(error));
    }
  }, [selectedMonitor]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeChange = (itemValue)=> {
    setSelectedTime(itemValue);
  };
  async function realizarReserva() {
    if (!selectedDate || !selectedMonitor || !titulo) {
      setErrorMessage('Por favor ingrese un titulo de reserva, el monitor, fecha y la hora deseada.');
      return;
    }
    try {
      const dateTime = selectedDate + ' ' + selectedTime;
      const requestData = {
        idMonitor: selectedMonitor,
        idRutina: rutinaID,
        title: titulo,
        fecha: dateTime
      };
      const respuesta = await fetch(`http://${IP}/reservarMovil`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        navigation.navigate('Ejercicios');
        alert("La reserva se ha creado correctamente");
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
          placeholder="Introduce titulo de reserva"
          autoCapitalize="words"
          value={titulo}
          onChangeText={settitulo}
        />
        <View style={styles.selector}>
          <Picker
            selectedValue={selectedMonitor}
            onValueChange={(itemValue, itemIndex) => setSelectedMonitor(itemValue)}
          >
            <Picker.Item label="Selecciona un monitor" value={null} />
            {monitores.map(monitor => (
              <Picker.Item label={monitor.nombre} value={monitor.id} key={monitor.id} />
            ))}
          </Picker>
        </View>
        <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true } }}
        style={styles.calendar}
        theme={{
          calendarBackground: '#f2f2f2',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#00adf5',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          monthTextColor: '#007AFF',
          indicatorColor: '#007AFF',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
      {selectedDate && (
  <View>
    <Text style={styles.label}>Selecciona una franja horaria:</Text>
    <View style={styles.selector}>
      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue, itemIndex) => handleTimeChange(itemValue)}
        style={styles.picker}
      >
        {timeOptions.map((time) => (
          <Picker.Item key={time} label={time} value={time} />
        ))}
      </Picker>
    </View>
  </View>
)}
          <TouchableOpacity style={styles.reservarButton} onPress={() => realizarReserva()}>
            <Text style={styles.buttonText}><Icon name='clipboard-check' type='font-awesome-5' color='#fff' size={16} /> Realizar Reserva</Text>
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
  reservarButton: {
    backgroundColor: '#2ecc71',
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
