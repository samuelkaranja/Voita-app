import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import MarketplaceScreen from '../screens/Marketplace/MarketplaceScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import InsuranceScreen from '../screens/Insurance/InsuranceScreen';
import ClaimsScreen from '../screens/Claims/ClaimsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0d2b1f',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Insurance" component={InsuranceScreen} />
      <Tab.Screen name="Claims" component={ClaimsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
