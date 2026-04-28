import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MarketplaceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.subtitle}>
        Discover parts, services & vehicle essentials
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
