import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Flame, Venus, AlertTriangle, Camera } from 'lucide-react-native';

interface Props {
  selected: string | null;
  setSelected: (value: string) => void;
  onSelect: (value: string) => void;
  isDarkMap: boolean;
}

export default function TagSelector({
  selected,
  setSelected,
  onSelect,
  isDarkMap,
}: Props) {
  const tags = [
    { label: 'Petrol', icon: Flame },
    { label: 'Lady-Friendly', icon: Venus },
    { label: 'Emergency', icon: AlertTriangle },
    { label: 'Speed Cameras', icon: Camera },
  ];

  const chipBg = isDarkMap ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)';
  const chipText = isDarkMap ? '#f2f2f2' : '#0d2b1f';

  return (
    <View style={styles.container}>
      {tags.map(tag => {
        const isActive = selected === tag.label;
        const Icon = tag.icon;
        return (
          <TouchableOpacity
            key={tag.label}
            onPress={() => onSelect(tag.label)}
            style={[
              styles.tag,
              { backgroundColor: chipBg },
              isActive && styles.activeTag,
            ]}
          >
            <Icon
              size={16}
              color={isActive ? '#fff' : chipText}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.text,
                { color: chipText },
                isActive && styles.activeText,
              ]}
            >
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
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  activeTag: {
    backgroundColor: '#0d2b1f',
  },
  text: {
    fontSize: 13,
  },
  activeText: {
    color: '#fff',
  },
});
