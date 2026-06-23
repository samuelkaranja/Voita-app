import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../../navigation/ProfileStack';

export default function VehicleCard() {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  return (
    <View style={{ marginBottom: 18 }}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>My Vehicle</Text>

        <TouchableOpacity
          style={styles.editRow}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Pencil size={16} color="#006c52" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
          }}
          style={styles.image}
        />

        <View style={styles.overlay}>
          <Text style={styles.plate}>KDJ 482L</Text>
          <Text style={styles.carName}>Land Rover Defender</Text>
          <Text style={styles.carMeta}>2023 · Pangea Green</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#001810',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    color: '#006c52',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 220,
  },
  image: {
    width: '100%',
    height: 220,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  plate: {
    color: '#001810',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 6,
  },
  carName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  carMeta: {
    color: '#d1fae5cc',
    fontSize: 14,
    lineHeight: 20,
  },
});
