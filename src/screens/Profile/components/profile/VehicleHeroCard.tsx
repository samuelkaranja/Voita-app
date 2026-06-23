import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Zap, Gauge } from 'lucide-react-native';

interface VehicleStat {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface Props {
  imageUri?: string;
  vehicleLabel: string;
  modelYear: string;
  color: string; 
  plateNumber: string;
  stats: VehicleStat[];
}

export const VehicleHeroCard: React.FC<Props> = ({
  imageUri,
  vehicleLabel,
  modelYear,
  color,
  plateNumber,
  stats,
}) => {
  return (
    <View style={styles.card}>
      {/* Vehicle Image */}
      <View style={styles.imageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Vehicle Label + Plate */}
      <Text style={styles.vehicleLabel}>Vehicle Type: {vehicleLabel}</Text>
      <Text style={styles.vehicleMeta}>Model Year: {modelYear} | Color: {color}</Text>
      <Text style={styles.plateNumber}>Plate Number: {plateNumber}</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <View style={styles.stat}>
              <View style={styles.statIconWrapper}>{stat.icon}</View>
              <View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            </View>
            {index < stats.length - 1 && <View style={styles.statDivider} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#D1D5DB',
  },
  vehicleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  vehicleMeta: {
  fontSize: 12,
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: 4,
},
  plateNumber: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
    alignSelf: 'stretch',
  },
});
