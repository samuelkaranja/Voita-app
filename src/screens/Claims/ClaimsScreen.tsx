import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ClaimsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Claims</Text>
      <Text style={styles.subtitle}>
        Track and manage your insurance claims
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0d2b1f",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
