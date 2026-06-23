import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Tab = 'personal' | 'vehicle';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const ProfileTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
        onPress={() => onTabChange('personal')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'personal' && styles.activeTabText,
          ]}
        >
          Personal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'vehicle' && styles.activeTab]}
        onPress={() => onTabChange('vehicle')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'vehicle' && styles.activeTabText,
          ]}
        >
          Vehicle
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#111827',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
