import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';

const dummyData = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://picsum.photos/id/237/200/200',
    messages: [
      {
        _id: 1,
        text: 'Hey, what\'s up?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Jane Doe',
          avatar: 'https://picsum.photos/id/238/200/200',
        },
      },
      {
        _id: 2,
        text: 'Not much, you?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/237/200/200',
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: 'https://picsum.photos/id/238/200/200',
    messages: [],
  },
  {
    id: 3,
    name: 'Bob Smith',
    avatar: 'https://picsum.photos/id/239/200/200',
    messages: [],
  },
];

const Friends = () => {
  const [data, setData] = useState(dummyData);
  const [messages, setMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setMessages(friend.messages);
  };

  const handleSend = (newMessages) => {
    const updatedData = data.map((friend) => {
      if (friend.id === selectedFriend.id) {
        return {
          ...friend,
          messages: GiftedChat.append(selectedFriend.messages, newMessages),
        };
      }
      return friend;
    });

    setData(updatedData);
    setSelectedFriend({ ...selectedFriend, messages: GiftedChat.append(selectedFriend.messages, newMessages) });
  };

  const renderItem = ({ item }) => (
    <ListItem onPress={() => handleSelectFriend(item)} bottomDivider>
      <Avatar source={{ uri: item.avatar }} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedFriend && (
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{ _id: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Friends;
