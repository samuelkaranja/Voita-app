import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import CustomTabBar from '../components/CustomTabBar';

import HomeScreen from '../screens/Home/HomeScreen';
import ProfileStack from './ProfileStack';
import ServicesStack from './ServicesStack';
import CommunityStack from './CommunityStack';

const Tab = createBottomTabNavigator();

function getCommunityTabBarStyle(route: any) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'CommunityRooms';
  return routeName === 'ChatRoom' ? { display: 'none' as const } : undefined;
}

export default function AppTabs() {
  return (
    <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={({ route }) => ({
          headerShown: false,
          tabBarStyle: getCommunityTabBarStyle(route),
        })}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
