import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, Button,FlatList, Image, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
const Stack = createStackNavigator();
import { Calendar } from 'react-native-calendars';
export default function Reserva({ route }) {
    const { item } = route.params;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [monitores, setMonitores] = useState([]);
    const [selectedMonitor, setSelectedMonitor] = useState(null);
    const [reservas, setReservas] = useState({});

  useEffect(() => {
    fetch('http://192.168.1.234:8080/monitores')
      .then(response => response.json())
      .then(data => setMonitores(data))
      .catch(error => console.error(error));
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const onTimePress = (time) => {
    setSelectedTime(time);
  };

  return (
    <View>
      <Text style={styles.label}>Monitor:</Text>
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
      />
      {selectedDate && (
        <View>
          <Text>Selecciona una franja horaria:</Text>
          <TouchableOpacity onPress={() => onTimePress('9:00am')}>
            <Text style={{ color: selectedTime === '9:00am' ? 'red' : 'black' }}>9:00am</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('10:00am')}>
            <Text style={{ color: selectedTime === '10:00am' ? 'red' : 'black' }}>10:00am</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('11:00am')}>
            <Text style={{ color: selectedTime === '11:00am' ? 'red' : 'black' }}>11:00am</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('12:00pm')}>
            <Text style={{ color: selectedTime === '12:00pm' ? 'red' : 'black' }}>12:00pm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('1:00pm')}>
            <Text style={{ color: selectedTime === '1:00pm' ? 'red' : 'black' }}>1:00pm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('2:00pm')}>
            <Text style={{ color: selectedTime === '2:00pm' ? 'red' : 'black' }}>2:00pm</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onTimePress('3:00pm')}>
            <Text style={{ color: selectedTime === '3:00pm' ? 'red' : 'black' }}>3:00pm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
});
