import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FormField } from '../profile/edit/FormField';
import { AddVehicleImageUploader } from './AddVehicleImageUploader';

interface BasicInfo {
  numberPlate: string;
  make: string;
  model: string;
  modelYear: string;
}

interface Props {
  imageUri?: string;
  info: BasicInfo;
  onImageChange: (uri: string) => void;
  onChange: (field: keyof BasicInfo, value: string) => void;
}

export const VehicleBasicInfoSection: React.FC<Props> = ({
  imageUri,
  info,
  onImageChange,
  onChange,
}) => {
  return (
    <View style={styles.card}>
      <AddVehicleImageUploader
        imageUri={imageUri}
        onImageChange={onImageChange}
      />

      <FormField
        label="Number Plate"
        value={info.numberPlate}
        onChangeText={v => onChange('numberPlate', v)}
        placeholder="e.g. KAB 123C"
        autoCapitalize="characters"
      />

      {/* Make + Model side by side */}
      <View style={styles.row}>
        <View style={styles.rowHalf}>
          <FormField
            label="Make"
            value={info.make}
            onChangeText={v => onChange('make', v)}
            placeholder="e.g. Toyota"
            autoCapitalize="words"
            containerStyle={styles.noBottomMargin}
          />
        </View>
        <View style={styles.rowHalf}>
          <FormField
            label="Model"
            value={info.model}
            onChangeText={v => onChange('model', v)}
            placeholder="e.g. Corolla"
            autoCapitalize="words"
            containerStyle={styles.noBottomMargin}
          />
        </View>
      </View>

      <View style={[styles.row, { marginTop: 12 }]}>
        <View style={styles.rowHalf}>
          <FormField
            label="Model Year"
            value={info.modelYear}
            onChangeText={v => onChange('modelYear', v)}
            placeholder="2024"
            keyboardType="numeric"
            maxLength={4}
            containerStyle={styles.noBottomMargin}
          />
        </View>
        {/* Spacer so year field doesn't stretch full width */}
        <View style={styles.rowHalf} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowHalf: {
    flex: 1,
  },
  noBottomMargin: {
    marginBottom: 0,
  },
});
