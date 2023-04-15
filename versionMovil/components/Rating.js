import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Rating = ({ defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handlePress = (newValue) => {
    setValue(newValue);
    onChange(newValue);
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <TouchableOpacity key={item} onPress={() => handlePress(item)}>
          <Ionicons
            name={item <= value ? 'md-star' : 'md-star-outline'}
            size={32}
            color={item <= value ? '#F2C94C' : '#EAEAEA'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Rating;
