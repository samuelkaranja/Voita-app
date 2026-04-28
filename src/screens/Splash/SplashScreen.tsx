import React, { useEffect } from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Auth");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1f" />

      <Image
        source={require("../../assets/images/VoitaLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 400,
    height: 400,
  },
});
