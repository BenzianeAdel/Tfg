import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import IP from '../config';
import { AsyncStorage } from 'react-native';
import Moment from 'moment';
import 'moment/locale/es';
import { Ionicons } from '@expo/vector-icons';


const ChatScreen = ({navigation,route}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [id,setId] = useState(0);
  const { userName } = route.params;
  const { iduserName} = route.params;
  const scrollViewRef = useRef();
  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: userName,
    });
  }, [navigation, userName]);

  useEffect(() => {
    async function fetchMensajes() {
      try {
        const response = await fetch(`http://${IP}/mensajesMovilRecuperar/${iduserName}`);
        const data = await response.json();
        setMessages(data); 
      } catch (error) {
        console.error(error);
      }
      const storedData = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(storedData);
      setId(userData.id);
    }
    fetchMensajes();
  }, [messages]);

  async function handleSendMessage() {
    try {
      const requestData = {
        texto: newMessage
      };
      const respuesta = await fetch(`http://${IP}/newmensaje/${iduserName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      setNewMessage('');
      scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.messageList}
        ref={scrollViewRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.emisor.id == id ? styles.sentMessage : styles.receivedMessage}>
            <Text>{item.texto}</Text>
            <Text style={styles.messageDate}>
              {Moment(item.fecha).locale('es').format('DD/MM/YYYY')} {' '}
              {Moment(item.fecha).locale('es').format('hh:mm a')}
            </Text>
          </View>
        )}
        initialNumToRender={messages.length}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send-outline" size={24} color="#FFDC00" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#6B3654',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10
    },
    messageList: {
      flex: 1,
      marginBottom: 10
    },
    sentMessage: {
        backgroundColor: '#ABFFDD',
        alignSelf: 'flex-end',
        padding: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        marginBottom: 5,
        marginLeft: 50
    },
    receivedMessage: {
        backgroundColor: '#f2f2f2',
        alignSelf: 'flex-start',
        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        marginBottom: 5,
        marginRight: 50
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      padding: 5,
      borderRadius: 10,
      marginLeft:10,
      marginRight: 10,
      marginBottom: 20
    },
    input: {
      flex: 1,
      padding: 10
    },
    messageDate: {
        color: '#888',
        fontSize: 12,
        alignSelf: 'flex-end'
    },  
});

export default ChatScreen;
