import React, { useEffect } from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Auth");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1f" />

      <View>
        {/* Shadow layer */}
        <Text style={styles.shadowText}>VOITA</Text>

        {/* Main glass text */}
        <Text style={styles.glassText}>VOITA</Text>

        {/* Highlight layer */}
        <Text style={styles.highlightText}>VOITA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d2b1f",
    justifyContent: "center",
    alignItems: "center",
  },

  // Base text style
  baseText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 8,
  },

  shadowText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 8,
    color: "rgba(0,0,0,0.4)",
    transform: [{ translateY: 3 }],
  },

  glassText: {
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 8,
    color: "rgba(255,255,255,0.25)", // transparent fill
  },

  highlightText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: 8,
    color: "rgba(255,255,255,0.6)",
    transform: [{ translateY: -1 }],
  },
});
