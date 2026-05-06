import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { BrainCircuit, CheckCircle2 } from 'lucide-react-native';

export default function ClaimNarrative() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BrainCircuit color="#006c52" size={24} />
        <Text style={styles.title}>What happened?</Text>
      </View>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="In your own words, tell us the story of the event. Don't worry about 'insurance speak'—just tell us what you remember."
        placeholderTextColor="#9CA3AF"
      />
      <View style={styles.footer}>
        <CheckCircle2 color="#6B7280" size={14} />
        <Text style={styles.footerText}>
          Your narrative helps us prioritize your mental well-being first.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f4f2',
    padding: 32,
    borderRadius: 32,
    marginBottom: 24,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001810',
    lineHeight: 28,
    marginLeft: 10,
  },
  textArea: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    height: 256,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 13 },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});
