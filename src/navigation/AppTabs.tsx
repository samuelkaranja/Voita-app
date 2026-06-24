import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CustomTabBar from '../components/CustomTabBar';

import MarketplaceHeader from '../components/MarketplaceHeader';
import CommunityHeader from '../components/CommunityHeader';
import InsuranceHeader from '../components/InsuranceHeader';
import ClaimsHeader from '../components/ClaimsHeader';

import HomeScreen from '../screens/Home/HomeScreen';
import MarketplaceScreen from '../screens/Marketplace/MarketplaceScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import InsuranceScreen from '../screens/Insurance/InsuranceScreen';
import ClaimsScreen from '../screens/Claims/ClaimsScreen';
import ProfileStack from './ProfileStack';
import ServicesStack from './ServicesStack';

const Tab = createBottomTabNavigator();

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
      {/* 
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ header: () => <MarketplaceHeader /> }}
      /> */}

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ header: () => <CommunityHeader /> }}
      />

      {/* <Tab.Screen
        name="Insurance"
        component={InsuranceScreen}
        options={{ header: () => <InsuranceHeader /> }}
      />

      <Tab.Screen
        name="Claims"
        component={ClaimsScreen}
        options={{ header: () => <ClaimsHeader /> }}
      /> */}

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
