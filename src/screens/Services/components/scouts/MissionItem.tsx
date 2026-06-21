import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

export type MissionStatus = 'active' | 'completed';

export interface MissionEntry {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  status: MissionStatus;
  costOrStatus: string;
  Icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

interface MissionItemProps {
  item: MissionEntry;
}

export const MissionItem: React.FC<MissionItemProps> = ({ item }) => {
  const isActive = item.status === 'active';

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: item.iconBgColor }]}>
        <item.Icon size={20} color={item.iconColor} strokeWidth={1.75} />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {item.subtitle}
          {item.detail ? (
            <Text style={styles.detail}> • {item.detail}</Text>
          ) : null}
        </Text>
      </View>

      {/* Badge */}
      <View style={[styles.badge, isActive && styles.badgeActive]}>
        <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
          {item.costOrStatus}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  detail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
  },
  badgeActive: {
    backgroundColor: '#ECFDF5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  badgeTextActive: {
    color: '#10B981',
    fontWeight: '700',
  },
});
