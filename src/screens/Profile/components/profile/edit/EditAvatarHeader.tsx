import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface Props {
  initialImageUri?: string;
  name: string;
  memberSince: string;
  onImageChange?: (uri: string) => void;
}

export const EditAvatarHeader: React.FC<Props> = ({
  initialImageUri,
  name,
  memberSince,
  onImageChange,
}) => {
  const [imageUri, setImageUri] = useState<string | undefined>(initialImageUri);

  const handleEditPhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        setImageUri(uri);
        onImageChange?.(uri); // bubble up to parent/Redux if needed
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>
              {name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.editBadge}
          onPress={handleEditPhoto}
          activeOpacity={0.8}
        >
          <Pencil size={12} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.memberSince}>{memberSince}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 13,
    color: '#6B7280',
  },
});
