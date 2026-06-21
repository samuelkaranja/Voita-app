import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServicesScreen from '../screens/Services/ServicesScreen';
import MechanicsScreen from '../screens/Services/MechanicsScreen';
import TowingScreen from '../screens/Services/TowingScreen';
import CarWashScreen from '../screens/Services/CarWashScreen';
import MechanicDetailScreen from '../screens/Services/MechanicDetailScreen';
import ServicesHeader from '../components/ServicesHeader';
import TowingDetailScreen from '../screens/Services/TowingDetailScreen';
import CarWashDetailScreen from '../screens/Services/CarWashDetailScreen';
import ScoutsScreen from '../screens/Services/ScoutsScreen';
import ScoutProfileScreen from '../screens/Services/ScoutProfileScreen';

export type ServicesStackParamList = {
  ServicesMain: undefined;
  MechanicsScreen: undefined;
  MechanicDetail: { mechanicId: string };
  TowingScreen: undefined;
  TowingDetail: { towingId: string };
  CarWashScreen: undefined;
  CarWashDetail: { carWashId: string };
  ScoutsScreen: undefined;
  ScoutProfile: { scoutId: string };
};

const Stack = createNativeStackNavigator<ServicesStackParamList>();

export default function ServicesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServicesMain"
        component={ServicesScreen}
        options={{ header: () => <ServicesHeader /> }}
      />
      <Stack.Screen
        name="MechanicsScreen"
        component={MechanicsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MechanicDetail"
        component={MechanicDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TowingScreen"
        component={TowingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TowingDetail"
        component={TowingDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CarWashScreen"
        component={CarWashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CarWashDetail"
        component={CarWashDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScoutsScreen"
        component={ScoutsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScoutProfile"
        component={ScoutProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
