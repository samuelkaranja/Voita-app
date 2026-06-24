import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusVariant = 'default' | 'warning' | 'danger' | 'info';

interface Props {
  category: string;
  title: string;
  metaLabel: string;
  metaValue: string;
  metaVariant?: StatusVariant;
  icon: React.ReactNode;
  accentColor: string;
}

const META_COLORS: Record<StatusVariant, string> = {
  default: '#111827',
  warning: '#D97706',
  danger: '#DC2626',
  info: '#2563EB',
};

const META_BG: Record<StatusVariant, string> = {
  default: '#F9FAFB',
  warning: '#FFFBEB',
  danger: '#FEF2F2',
  info: '#EFF6FF',
};

const META_LABELS: Record<StatusVariant, string> = {
  default: 'On Track',
  warning: 'Attention',
  danger: 'Overdue',
  info: 'Active',
};

export const MaintenanceCard: React.FC<Props> = ({
  category,
  title,
  metaLabel,
  metaValue,
  metaVariant = 'default',
  icon,
  accentColor,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        {/* Top row: category label + icon */}
        <View style={styles.topRow}>
          <Text style={styles.category}>{category}</Text>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${accentColor}18` },
            ]}
          >
            {icon}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Bottom row: date value + status badge */}
        <View style={styles.bottomRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.metaLabel}>{metaLabel}</Text>
            <Text style={styles.metaValue}>{metaValue}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: META_BG[metaVariant] },
            ]}
          >
            <Text
              style={[styles.statusText, { color: META_COLORS[metaVariant] }]}
            >
              {META_LABELS[metaVariant]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  body: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: '#9CA3AF',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dateBlock: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
