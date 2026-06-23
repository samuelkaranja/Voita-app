import React from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Droplet, Gauge } from 'lucide-react-native';

import ProfileHeader from './components/ProfileHeader';
import VehicleCard from './components/VehicleCard';
import InfoCard from './components/InfoCard';
import TireConfigCard from './components/TireConfigCard';
import CriticalRemindersSection from './components/CriticalRemindersSection';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../redux/slices/auth/authSlice';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    dispatch(logout());

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
      >
        <ProfileHeader />

        <VehicleCard />

        {/* Info Cards */}
        <View style={styles.row}>
          <InfoCard
            icon={<Droplet size={20} color="#006c52" />}
            title="OIL TYPE"
            value="5W-30 Synthetic"
          />

          <InfoCard
            icon={<Gauge size={20} color="#006c52" />}
            title="TIRE PRESSURE"
            value="32 PSI"
          />
        </View>

        <TireConfigCard />

        <CriticalRemindersSection />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7faf8',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    marginBottom: 10,
  },

  logoutButton: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
