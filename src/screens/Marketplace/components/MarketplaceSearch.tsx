import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react-native';

export default function MarketplaceSearch() {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <Search size={18} color="#6B7280" />
        <TextInput
          placeholder="Search mechanics, paint, shocks..."
          placeholderTextColor="#6B7280"
          style={styles.input}
        />
      </View>

      {/* Location */}
      <View style={styles.inputContainer}>
        <MapPin size={18} color="#6B7280" />
        <Text style={styles.locationText}>Near San Francisco, CA</Text>
      </View>

      {/* Refine Button */}
      <TouchableOpacity style={styles.button}>
        <SlidersHorizontal size={16} color="#FFFFFF" />
        <Text style={styles.buttonText}>Refine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',

    // subtle card feel
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },

  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#0D2B1F',
  },

  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4A5A57',
  },

  button: {
    marginTop: 6,
    backgroundColor: '#062E22',
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
