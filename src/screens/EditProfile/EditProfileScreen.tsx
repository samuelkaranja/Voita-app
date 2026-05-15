import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import UserDetailsTab from './components/UserDetailsTab';
import VehicleDetailsTab from './components/VehicleDetailsTab';

export default function EditProfileScreen({ token }: any) {
  const [activeTab, setActiveTab] = useState<'user' | 'vehicle'>('user');

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'user' && styles.activeTab]}
          onPress={() => setActiveTab('user')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'user' && styles.activeTabText,
            ]}
          >
            User Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'vehicle' && styles.activeTab]}
          onPress={() => setActiveTab('vehicle')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'vehicle' && styles.activeTabText,
            ]}
          >
            Vehicle Details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === 'user' ? <UserDetailsTab token={token} /> : <VehicleDetailsTab token={token} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: '#006c52',
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#006c52',
    fontWeight: '700',
  },
});
