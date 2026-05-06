import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function DiscussionSection() {
  const circles = [
    { name: 'German Engineering', count: '12k', color: '#D1FAE5' },
    { name: 'Japanese Reliability', count: '45k', color: '#F3F4F6' },
    { name: 'EV & Hybrids', count: '8k', color: '#D1FAE5' },
    { name: 'Off-Road & 4x4', count: '15k', color: '#F3F4F6' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Active Discussions</Text>
      <Text style={styles.description}>
        Join specific manufacturer circles or general maintenance threads. Share
        experiences and get verified advice.
      </Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterBtn, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>Popular</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Latest</Text>
        </TouchableOpacity>
      </View>

      {/* Main Card Content */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>MANUFACTURER CIRCLES</Text>

        {circles.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.circleName}>{item.name}</Text>
            <View style={[styles.badge, { backgroundColor: item.color }]}>
              <Text style={styles.badgeText}>{item.count}</Text>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>EXPERT ADVICE</Text>

        <TouchableOpacity style={styles.expertCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with expert image
            style={styles.avatar}
          />
          <View>
            <Text style={styles.expertName}>Ask Eng. Kamau</Text>
            <Text style={styles.expertRole}>ENGINE SPECIALIST</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#061C14',
    borderColor: '#061C14',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterText: {
    color: '#111827',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f1f4f2',
    borderRadius: 16,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 1,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  circleName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  expertCard: {
    backgroundColor: '#e0e3e1',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#CBD5E1',
  },
  expertName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  expertRole: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669', // Green accent
    marginTop: 2,
  },
});
