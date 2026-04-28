import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import RootNavigator from "./src/navigation/RootNavigator";

enableScreens();

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
