import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ProfileImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result.didCancel && result.assets) {
      setImage(result.assets[0].uri || null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            image ? { uri: image } : require('../../../assets/images/car.png')
          }
          style={styles.image}
        />
      </TouchableOpacity>
      <Text style={styles.text}>Change Profile Photo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: 20 },
  image: { width: 110, height: 110, borderRadius: 50 },
  text: { marginTop: 10, color: '#006c52' },
});
