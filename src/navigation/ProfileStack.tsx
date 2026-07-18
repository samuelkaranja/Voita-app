import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/EditProfile/EditProfileScreen';
import { EditPersonalDetailsScreen } from '../screens/Profile/EditPersonalDetailsScreen';
import { EditVehicleDetailsScreen } from '../screens/Profile/EditVehicleDetailsScreen';
import { AddVehicleScreen } from '../screens/Profile/AddVehicleScreen';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  EditPersonalDetails: undefined;
  EditVehicleDetails: { vehicleId: string };
  AddVehicle: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="EditPersonalDetails"
        component={EditPersonalDetailsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EditVehicleDetails"
        component={EditVehicleDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddVehicle"
        component={AddVehicleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
