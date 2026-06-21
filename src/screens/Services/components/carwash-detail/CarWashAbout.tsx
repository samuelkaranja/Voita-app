import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TextSegment {
  text: string;
  highlighted?: boolean;
}

interface CarWashAboutProps {
  title: string;
  segments: TextSegment[];
}

export const CarWashAbout: React.FC<CarWashAboutProps> = ({
  title,
  segments,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <Text key={i} style={styles.highlighted}>
              {seg.text}
            </Text>
          ) : (
            <Text key={i}>{seg.text}</Text>
          ),
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  body: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  highlighted: {
    color: '#10B981',
    fontWeight: '600',
  },
});
