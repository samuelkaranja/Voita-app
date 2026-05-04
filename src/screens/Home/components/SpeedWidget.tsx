import React from "react";
import { View, Text } from "react-native";

export default function SpeedWidget({ speed }: any) {
  return (
    <View style={{ position: "absolute", bottom: 200, left: 20, zIndex: 10, }}>
      <Text>Speed: {speed ? (speed * 3.6).toFixed(1) : "0.0"} km/h</Text>
    </View>
  );
}
