// components/AppHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";

export default function AppHeader() {
  return (
    <View style={styles.container}>
      {/* Text Logo */}
      <Text style={styles.logo}>
        Vo<Text style={styles.highlight}>ita</Text>
      </Text>

      {/* Notification Icon */}
      <TouchableOpacity onPress={() => console.log("Notifications pressed")}>
        <Bell size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 5,
  },
  highlight: {
    color: "#2E7D32",
  }
});
