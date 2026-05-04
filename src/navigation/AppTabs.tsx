import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Lucide icons
import {
  Home,
  ShoppingCart,
  Users,
  ShieldCheck,
  FileText,
  User,
} from 'lucide-react-native';

import AppHeader from "../components/AppHeader";
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
      screenOptions={({ route }) => ({
        header: () => <AppHeader />,

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Insurance" component={InsuranceScreen} />
      <Tab.Screen name="Claims" component={ClaimsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
