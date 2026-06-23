import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Props {
  imageUri?: string;
  name: string;
  membershipLabel?: string;
}

export const ProfileAvatar: React.FC<Props> = ({
  imageUri,
  name,
  membershipLabel = 'Voita Premium Member',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.membership}>{membershipLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  membership: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
});
