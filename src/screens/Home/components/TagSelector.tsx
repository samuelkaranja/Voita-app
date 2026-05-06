import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Flame, Venus, AlertTriangle } from 'lucide-react-native';

export default function TagSelector({ selected, setSelected }) {
  const tags = [
    { label: 'Petrol', icon: Flame },
    { label: 'Lady-Friendly', icon: Venus },
    { label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        zIndex: 10,
      }}
    >
      {tags.map(tag => {
        const isActive = selected === tag.label;
        const Icon = tag.icon;

        return (
          <TouchableOpacity
            key={tag.label}
            onPress={() => setSelected(tag.label)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: isActive ? '#0d2b1f' : '#e5e5e5',
              marginHorizontal: 6,
              borderRadius: 20,
            }}
          >
            <Icon
              size={16}
              color={isActive ? '#fff' : '#333'}
              style={{ marginRight: 6 }}
            />

            <Text style={{ color: isActive ? '#fff' : '#333' }}>
              {tag.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
