import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommunityScreen from '../screens/Community/CommunityScreen';
import BrowseRoomsScreen from '../screens/Community/BrowseRoomsScreen';
import ChatRoomScreen from '../screens/Community/ChatRoomScreen';

export type CommunityStackParamList = {
  CommunityRooms: undefined;
  BrowseRooms: undefined;
  ChatRoom: { roomId: string; roomName: string };
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CommunityRooms"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseRooms"
        component={BrowseRoomsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
