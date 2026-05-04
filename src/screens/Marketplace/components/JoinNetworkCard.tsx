import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Keyboard 
} from 'react-native';

export default function JoinNetworkCard () {
  const [email, setEmail] = useState('');

  const handleJoin = () => {
    console.log('Joining with:', email);
    // Add your logic for joining the network here
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Join the Archivist Network</Text>
      
      <Text style={styles.subHeaderText}>
        Get exclusive maintenance tips from master mechanics and priority booking for Ezra Insure members.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#4A6150"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.joinButton} 
          onPress={handleJoin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>JOIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#041E13', // Deep dark green background
    borderRadius: 24,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subHeaderText: {
    color: '#8A9A8E', // Dimmer green-gray for readability
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#0A291C', // Slightly lighter green for the input box
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#143828',
  },
  joinButton: {
    backgroundColor: '#98FBCA', // Mint green accent
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#041E13', // Dark text on light button
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
