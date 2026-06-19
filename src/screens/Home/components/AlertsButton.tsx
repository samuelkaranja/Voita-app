import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, AlertTriangle, TrafficCone, X } from 'lucide-react-native';

interface Alert {
  id: string;
  type: 'flood' | 'congestion';
  title: string;
  subtitle: string;
}

interface Props {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export default function AlertsButton({ alerts, onDismiss }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (alerts.length === 0) return null;

  return (
    <>
      {/* Bell button — sits in the top row */}
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => setExpanded(prev => !prev)}
        activeOpacity={0.8}
      >
        <Bell size={18} color="#fff" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{alerts.length}</Text>
        </View>
      </TouchableOpacity>

      {/* Panel renders OUTSIDE the row, in the parent column */}
      {expanded && (
        <View style={styles.panel}>
          {alerts.map(alert => (
            <View key={alert.id} style={styles.alertRow}>
              <View
                style={[
                  styles.alertIcon,
                  alert.type === 'congestion' && styles.alertIconLight,
                ]}
              >
                {alert.type === 'flood' ? (
                  <AlertTriangle size={15} color="#8ff6d0" />
                ) : (
                  <TrafficCone size={15} color="#e65100" />
                )}
              </View>

              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertSubtitle}>{alert.subtitle}</Text>
              </View>

              <TouchableOpacity
                onPress={() => onDismiss(alert.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={14} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 43, 31, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  panel: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    gap: 10,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#052f23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIconLight: {
    backgroundColor: '#fff3e0',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#001810',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 11,
    color: '#555',
  },
});
