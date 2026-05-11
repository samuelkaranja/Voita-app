import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  ShoppingCart,
  Users,
  ShieldCheck,
  FileText,
  User,
} from 'lucide-react-native';

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

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0d2b1f',
        tabBarInactiveTintColor: '#999999',

        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home size={size} color={color} />;
            case 'Marketplace':
              return <ShoppingCart size={size} color={color} />;
            case 'Community':
              return <Users size={size} color={color} />;
            case 'Insurance':
              return <ShieldCheck size={size} color={color} />;
            case 'Claims':
              return <FileText size={size} color={color} />;
            case 'Profile':
              return <User size={size} color={color} />;
            default:
              return <Home size={size} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{ header: () => <MarketplaceHeader /> }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{ header: () => <CommunityHeader /> }}
      />
      <Tab.Screen
        name="Insurance"
        component={InsuranceScreen}
        options={{ header: () => <InsuranceHeader /> }}
      />
      <Tab.Screen
        name="Claims"
        component={ClaimsScreen}
        options={{ header: () => <ClaimsHeader /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
