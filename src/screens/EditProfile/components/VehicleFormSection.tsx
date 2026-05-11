import React from 'react';
import { View, TextInput } from 'react-native';

export default function VehicleFormSection({
  vehicle,
  setVehicle,
}: any) {
  return (
    <View>
      <TextInput
        placeholder="Color"
        value={vehicle.color}
        onChangeText={t =>
          setVehicle({ ...vehicle, color: t })
        }
      />

      <TextInput
        placeholder="Year"
        value={String(vehicle.year)}
        onChangeText={t =>
          setVehicle({ ...vehicle, year: Number(t) })
        }
      />
    </View>
  );
}
