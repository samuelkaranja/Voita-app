import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type StatusVariant = 'default' | 'warning' | 'danger' | 'info';

interface Props {
  category: string;
  title: string;
  metaLabel: string;
  metaValue: string;
  metaVariant?: StatusVariant;
  icon: React.ReactNode;
  accentColor: string;
  onActionPress?: () => void;
}

const META_COLORS: Record<StatusVariant, string> = {
  default: '#111827',
  warning: '#16A34A', // green — "upcoming / in X km"
  danger: '#DC2626', // red — "action required"
  info: '#2563EB',
};

export const MaintenanceCard: React.FC<Props> = ({
  category,
  title,
  metaLabel,
  metaValue,
  metaVariant = 'default',
  icon,
  accentColor,
  onActionPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.category}>{category}</Text>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${accentColor}15` },
            ]}
          >
            {icon}
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>{metaLabel}</Text>
          <Text style={[styles.metaValue, { color: META_COLORS[metaVariant] }]}>
            {metaValue}
          </Text>
        </View>

        {/* ── Action button — only renders if onActionPress is provided ── */}
        {onActionPress && (
          <TouchableOpacity
            onPress={onActionPress}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, { color: accentColor }]}>
              {category === 'Insurance' || category === 'License'
                ? 'RENEW'
                : category === 'Service'
                ? 'BOOK NOW'
                : 'SCHEDULE'}
            </Text>
          </TouchableOpacity>
        )}
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
    fontWeight: '500',
    color: '#111827',
    marginBottom: 10,
  },
  metaBlock: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
