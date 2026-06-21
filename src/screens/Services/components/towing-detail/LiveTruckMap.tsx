import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Truck, Locate } from 'lucide-react-native';

interface LiveTruckMapProps {
  truckLabel: string;
  driverName: string;
  avgTimeMinutes: number;
  fleetSize: string;
  isActive: boolean;
  onLocate?: () => void;
}

export const LiveTruckMap: React.FC<LiveTruckMapProps> = ({
  truckLabel,
  driverName,
  avgTimeMinutes,
  fleetSize,
  isActive,
  onLocate,
}) => {
  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>LIVE TRUCK LOCATION</Text>
        <View style={styles.activeRow}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>

      {/* Map area */}
      <View style={styles.mapArea}>
        {/* Gradient-style placeholder */}
        <View style={styles.mapBackground} />

        {/* Truck label pill */}
        <View style={styles.truckLabel}>
          <Text style={styles.truckLabelText}>{truckLabel}</Text>
        </View>

        {/* Truck icon */}
        <View style={styles.truckIconWrapper}>
          <Truck size={32} color="#374151" strokeWidth={1.75} />
        </View>

        {/* Locate FAB */}
        <TouchableOpacity
          style={styles.locateBtn}
          onPress={onLocate}
          activeOpacity={0.8}
        >
          <Locate size={18} color="#374151" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Driver row */}
      <View style={styles.driverRow}>
        <MapPin size={14} color="#9CA3AF" strokeWidth={2} />
        <View>
          <Text style={styles.driverLabel}>Driver</Text>
          <Text style={styles.driverName}>{driverName}</Text>
        </View>
      </View>

      {/* Stats pills */}
      <View style={styles.statsRow}>
        <View style={[styles.statPill, { backgroundColor: '#ECFDF5' }]}>
          <Text style={styles.statLabel}>AVG TIME</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {avgTimeMinutes}m
          </Text>
        </View>
        <View style={[styles.statPill, { backgroundColor: '#EFF6FF' }]}>
          <Text style={styles.statLabel}>FLEET SIZE</Text>
          <Text style={[styles.statValue, { color: '#3B82F6' }]}>
            {fleetSize}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  mapArea: {
    height: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#C8E6C9',
    // In production swap for a real MapView or static map image
  },
  truckLabel: {
    position: 'absolute',
    top: 20,
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  truckLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  truckIconWrapper: {
    marginTop: 24,
  },
  locateBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  driverLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  driverName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  statPill: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
