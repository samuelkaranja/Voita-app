import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voita Home</Text>
      <Text style={styles.subtitle}>
        Welcome back 👋 Explore your driving ecosystem
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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
