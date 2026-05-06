import React, { useEffect } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d2b1f" />

      <Text style={styles.mainText}>VOITA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2b1f',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 10,
    color: '#ffffff',
  },
});
