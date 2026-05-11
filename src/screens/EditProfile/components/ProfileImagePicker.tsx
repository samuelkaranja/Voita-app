import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileImagePicker({
  image,
  onChange,
}: any) {
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result.assets?.length) {
      onChange(result.assets[0]);
    }
  };

  return (
    <View>
      <Image
        source={{ uri: image }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />

      <TouchableOpacity onPress={pickImage}>
        <Text>Change Photo</Text>
      </TouchableOpacity>
    </View>
  );
}
