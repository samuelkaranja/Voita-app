import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface Props {
  imageUri?: string;
  onImageChange: (uri: string) => void;
}

export const VehicleImagePicker: React.FC<Props> = ({
  imageUri,
  onImageChange,
}) => {
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.assets && response.assets[0]?.uri) {
        onImageChange(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder} />
      )}
      <TouchableOpacity
        style={styles.editBadge}
        onPress={handlePickImage}
        activeOpacity={0.8}
      >
        <Pencil size={14} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 200,
    backgroundColor: '#111827',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  editBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
