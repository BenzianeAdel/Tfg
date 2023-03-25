import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Button,FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
const Stack = createStackNavigator();
import { Calendar } from 'react-native-calendars';

export default function Reserva({ route }) {
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
    const { item } = route.params;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
    const [monitores, setMonitores] = useState([]);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [titulo,settitulo] = useState('');
    const [reservas, setReservas] = useState({});
    

  useEffect(() => {
    fetch('http://192.168.43.18:8080/monitores')
      .then(response => response.json())
      .then(data => setMonitores(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedMonitor) {
        fetch(`http://192.168.43.18:8080/monitores/${selectedMonitor}/reservas`)
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
    try {
      const dateTime = selectedDate + ' ' + selectedTime;
      const requestData = {
        idMonitor: selectedMonitor,
        idActividad: item,
        titulo: titulo,
        fecha: dateTime
      };
      console.log(requestData);
      const respuesta = await fetch('http://192.168.43.18:8080/reservarMovil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
        // Puedes agregar aquí el token de autenticación si es necesario
      });
      if (respuesta.ok) {
        alert(respuesta.json().message);
      } else {
        console.error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
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
)}
          <TouchableOpacity style={styles.seguirButton} onPress={() => realizarReserva()}>
            <Icon name='clipboard-check' type='font-awesome-5' color='#fff' size={14} />
            <Text style={styles.buttonText}>Realizar Reserva</Text>
          </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFE0',
  },
  selector: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendar: {
    marginBottom: 20,
  },
  timeContainer: {
    marginBottom: 20,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
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
    color: '#333',
  },
  input: {
    height: 40,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  }
});
