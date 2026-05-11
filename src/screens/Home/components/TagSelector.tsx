import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Flame, Venus, AlertTriangle } from 'lucide-react-native';

interface Props {
  selected: string | null;
  setSelected: (value: string) => void;
  onSelect: (value: string) => void;
}

export default function TagSelector({
  selected,
  setSelected,
  onSelect,
}: Props) {
  const tags = [
    { label: 'Petrol', icon: Flame },
    { label: 'Lady-Friendly', icon: Venus },
    { label: 'Emergency', icon: AlertTriangle },
  ];

  console.log('onSelect:', onSelect);

  return (
    <View style={styles.container}>
      {tags.map(tag => {
        const isActive = selected === tag.label;
        const Icon = tag.icon;

        return (
          <TouchableOpacity
            key={tag.label}
            onPress={() => {
              console.log('TAG CLICKED:', tag.label);
              setSelected(tag.label);
              onSelect && onSelect(tag.label);
            }}
            style={[styles.tag, isActive && styles.activeTag]}
          >
            <Icon
              size={16}
              color={isActive ? '#fff' : '#0d2b1f'}
              style={{ marginRight: 6 }}
            />

            <Text style={[styles.text, isActive && styles.activeText]}>
              {tag.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#e5e5e5',
  },

  activeTag: {
    backgroundColor: '#0d2b1f',
  },

  text: {
    fontSize: 13,
    color: '#0d2b1f',
  },

  activeText: {
    color: '#fff',
  },
});
