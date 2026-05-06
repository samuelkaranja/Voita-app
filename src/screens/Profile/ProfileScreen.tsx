import React from 'react';
import { StatusBar, View, StyleSheet, ScrollView } from 'react-native';
import { Droplet, Gauge } from 'lucide-react-native';

import ProfileHeader from './components/ProfileHeader';
import VehicleCard from './components/VehicleCard';
import InfoCard from './components/InfoCard';
import TireConfigCard from './components/TireConfigCard';
import CriticalRemindersSection from './components/CriticalRemindersSection';

export default function ProfileScreen() {
  return (
    <>
      <StatusBar backgroundColor="#001810" barStyle="light-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
});
