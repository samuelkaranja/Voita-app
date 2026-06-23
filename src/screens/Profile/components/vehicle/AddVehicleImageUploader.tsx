import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CameraIcon } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface Props {
  imageUri?: string;
  onImageChange: (uri: string) => void;
}

export const AddVehicleImageUploader: React.FC<Props> = ({
  imageUri,
  onImageChange,
}) => {
  const handlePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) onImageChange(uri);
    });
  };

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={handlePick}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <CameraIcon size={32} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.placeholderText}>Upload Vehicle Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
