import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

export default function SubmitFooter({ onSubmit }) {
  return (
    <View style={styles.container}>
      <View style={styles.privacyRow}>
        <View style={styles.iconBg}>
          <ShieldCheck color="#6EE7B7" size={24} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.privacyTitle}>Encrypted & Private</Text>
          <Text style={styles.privacyDesc}>
            Your voice and photos are protected by Ezra's botanical privacy
            core.
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Submit Claim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 1,
    marginTop: 10,
    marginBottom: 20,
  },
  privacyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconBg: {
    width: 50,
    height: 60,
    backgroundColor: '#064E3B',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 28,
  },
  privacyDesc: { fontSize: 14, color: '#414845', lineHeight: 20, marginTop: 4 },
  button: {
    backgroundColor: '#001810',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
