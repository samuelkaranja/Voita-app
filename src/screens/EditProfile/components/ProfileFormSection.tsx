import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function ProfileFormSection({ user, setUser }: any) {
  return (
    <View style={styles.container}>
      {/* First Name */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={user.firstName}
        onChangeText={t => setUser({ ...user, firstName: t })}
      />

      {/* Last Name */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={user.lastName}
        onChangeText={t => setUser({ ...user, lastName: t })}
      />

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={t => setUser({ ...user, email: t })}
        keyboardType="email-address"
      />

      {/* Phone Number (READ-ONLY) */}
      <View style={styles.readOnlyContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user.phone}
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
  },
  readOnlyContainer: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  disabledInput: {
    backgroundColor: '#f2f2f2',
    color: '#888',
  },
});
