import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import InputField from './InputField';
import { Pencil } from 'lucide-react-native';

interface VehicleSectionProps {
  data: {
    plateNumber: string;
    model: string;
    year: string;
    color: string;
    image?: string;
  };
  onChange: (field: string, value: string) => void;
  onEditImage?: () => void;
}

export default function VehicleSection({
  data,
  onChange,
  onEditImage,
}: VehicleSectionProps) {
  return (
    <>
      {/* Vehicle Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              data.image ||
              'https://images.unsplash.com/photo-1549924231-f129b911e442',
          }}
          style={styles.image}
        />

        {onEditImage && (
          <TouchableOpacity style={styles.icon} onPress={onEditImage}>
            <Pencil size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Row 1 */}
      <View style={styles.row}>
        <InputField
          label="Plate Number"
          value={data.plateNumber}
          onChangeText={text => onChange('plateNumber', text)}
        />

        <InputField
          label="Model"
          value={data.model}
          onChangeText={text => onChange('model', text)}
        />
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        <InputField
          label="Year"
          value={data.year}
          onChangeText={text => onChange('year', text)}
        />

        <InputField
          label="Color"
          value={data.color}
          onChangeText={text => onChange('color', text)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  icon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0B3D2E',
    padding: 8,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
