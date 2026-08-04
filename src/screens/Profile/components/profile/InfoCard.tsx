import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InfoField } from './InfoField';

interface Field {
  label: string;
  value: string;
  maskable?: boolean;
}

interface Props {
  fields: Field[];
}

export const InfoCard: React.FC<Props> = ({ fields }) => {
  return (
    <View style={styles.card}>
      {fields.map((field, index) => (
        <InfoField
          key={field.label}
          label={field.label}
          value={field.value}
          isLast={index === fields.length - 1}
          maskable={field.maskable}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
