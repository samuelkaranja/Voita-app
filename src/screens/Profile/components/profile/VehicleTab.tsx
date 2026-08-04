import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import {
  Shield,
  IdCard,
  Wrench,
  GitFork,
  Plus,
  Car,
  Zap,
  Palette,
  BadgeCheck,
  Hash,
  Pencil,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionHeader } from './SectionHeader';
import { MaintenanceCard } from './MaintenanceCard';
import { ProfileStackParamList } from '../../../../navigation/ProfileStack';
import { VehicleBenefitsBanner } from '../vehicle/VehicleBenefitsBanner';
//import { VehicleBenefitsBanner } from './VehicleBenefitsBanner';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

export interface VehicleInfo {
  id: string;
  color: string;
  modelYear: string;
  imageUri?: string;
  label: string;
  plateNumber: string;
  fuelType: string;
  tirePressure: string;
  alloyType?: string;
  pressureFront?: string;
  pressureRear?: string;
  isCalibrated?: boolean;
  maintenance: MaintenanceItem[];
}

export interface MaintenanceItem {
  id: string;
  category: string;
  title: string;
  metaLabel: string;
  metaValue: string;
  metaVariant: 'default' | 'warning' | 'danger' | 'info';
  accentColor: string;
  iconKey: 'insurance' | 'license' | 'service' | 'tires';
}

interface Props {
  mappedVehicles: VehicleInfo[];
  onVehicleSelect?: (vehicleId: string) => void;
  onEditPress?: () => void;
}

const MAINTENANCE_ICONS: Record<
  MaintenanceItem['iconKey'],
  (color: string) => React.ReactNode
> = {
  insurance: color => <Shield size={16} color={color} strokeWidth={2} />,
  license: color => <IdCard size={16} color={color} strokeWidth={2} />,
  service: color => <Wrench size={16} color={color} strokeWidth={2} />,
  tires: color => <GitFork size={16} color={color} strokeWidth={2} />,
};

const MAINTENANCE_ACTIONS: Record<
  MaintenanceItem['iconKey'],
  (navigation: NavProp) => void
> = {
  insurance: () => Linking.openURL('https://voita.com/renew/insurance'),
  license: () => Linking.openURL('https://voita.com/renew/license'),
  service: nav => nav.navigate('BookService' as any),
  tires: nav => nav.navigate('BookService' as any),
};

// ── Stat pill used in the detail grid ────────────────────────────────────────
interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon, label, value }) => (
  <View style={pillStyles.container}>
    <View style={pillStyles.iconWrap}>{icon}</View>
    <View style={pillStyles.textWrap}>
      <Text style={pillStyles.label}>{label}</Text>
      <Text style={pillStyles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  </View>
);

const pillStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.4,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
});

// ── Tire pressure row — full width ────────────────────────────────────────────
interface TirePressureRowProps {
  front?: string;
  rear?: string;
  alloyType?: string;
  isCalibrated?: boolean;
}

const TirePressureRow: React.FC<TirePressureRowProps> = ({
  front,
  rear,
  alloyType,
  isCalibrated,
}) => {
  console.log('🛞 [TirePressureRow] received props:', {
    front,
    rear,
    alloyType,
    isCalibrated,
  });

  return (
    <View style={tireStyles.card}>
      <View style={tireStyles.header}>
        <GitFork size={14} color="#6B7280" strokeWidth={2} />
        <Text style={tireStyles.heading}>Tyre Configuration</Text>
        {isCalibrated ? (
          <View style={tireStyles.badge}>
            <BadgeCheck size={11} color="#10B981" strokeWidth={2.5} />
            <Text style={tireStyles.badgeText}>Calibrated</Text>
          </View>
        ) : (
          <View style={[tireStyles.badge, tireStyles.badgeUncalibrated]}>
            <Text style={tireStyles.badgeTextUncalibrated}>Uncalibrated</Text>
          </View>
        )}
      </View>

      <View style={tireStyles.row}>
        <View style={tireStyles.cell}>
          <Text style={tireStyles.cellLabel}>FRONT PSI</Text>
          <Text style={tireStyles.cellValue}>{front ?? '—'}</Text>
        </View>
        <View style={tireStyles.divider} />
        <View style={tireStyles.cell}>
          <Text style={tireStyles.cellLabel}>REAR PSI</Text>
          <Text style={tireStyles.cellValue}>{rear ?? '—'}</Text>
        </View>
        <View style={tireStyles.divider} />
        <View style={tireStyles.cell}>
          <Text style={tireStyles.cellLabel}>ALLOY</Text>
          <Text style={tireStyles.cellValue}>{alloyType || '—'}</Text>
        </View>
      </View>
    </View>
  );
};

const tireStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
  },
  badgeUncalibrated: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextUncalibrated: {
    fontSize: 10,
    fontWeight: '600',
    color: '#D97706',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
  },
  cellValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
});

// ── Hero card replacing VehicleHeroCard ───────────────────────────────────────
interface HeroProps {
  vehicle: VehicleInfo;
}

const VehicleDetailHero: React.FC<HeroProps> = ({ vehicle }) => (
  <View style={heroStyles.card}>
    {vehicle.imageUri ? (
      <Image
        source={{ uri: vehicle.imageUri }}
        style={heroStyles.image}
        resizeMode="cover"
      />
    ) : (
      <View style={heroStyles.imagePlaceholder}>
        <Car size={40} color="#D1D5DB" strokeWidth={1.5} />
      </View>
    )}

    <View style={heroStyles.identityRow}>
      <View style={{ flex: 1 }}>
        <Text style={heroStyles.vehicleLabel}>{vehicle.label}</Text>
        <Text style={heroStyles.modelYear}>{vehicle.modelYear}</Text>
      </View>
      <View style={heroStyles.plateBadge}>
        <Hash size={11} color="#6B7280" strokeWidth={2.5} />
        <Text style={heroStyles.plateText}>{vehicle.plateNumber}</Text>
      </View>
    </View>

    {/* Only fuel + color here — pressure lives in TirePressureRow below */}
    <View style={heroStyles.statsGrid}>
      <StatPill
        icon={<Zap size={15} color="#F59E0B" strokeWidth={2} />}
        label="Fuel Type"
        value={vehicle.fuelType || '—'}
      />
      <StatPill
        icon={<Palette size={15} color="#8B5CF6" strokeWidth={2} />}
        label="Color"
        value={vehicle.color || '—'}
      />
    </View>
  </View>
);

const heroStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 10,
  },
  vehicleLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  modelYear: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  plateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  plateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 0,
  },
});

// ── Main VehicleTab ───────────────────────────────────────────────────────────
export const VehicleTab: React.FC<Props> = ({
  mappedVehicles,
  onVehicleSelect,
  onEditPress,
}) => {
  const navigation = useNavigation<NavProp>();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleChipPress = (index: number) => {
    setSelectedIndex(index);
    const vehicle = mappedVehicles[index];
    if (vehicle && onVehicleSelect) onVehicleSelect(vehicle.id);
  };

  if (!mappedVehicles || mappedVehicles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Car size={36} color="#9CA3AF" strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>No vehicle added yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your vehicle to manage maintenance and track safety details.
        </Text>
        <TouchableOpacity
          style={styles.addFirstButton}
          onPress={() => navigation.navigate('AddVehicle')}
          activeOpacity={0.85}
        >
          <Text style={styles.addFirstButtonText}>Add New Vehicle</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedVehicle = mappedVehicles[selectedIndex] ?? mappedVehicles[0];

  return (
    <View style={styles.container}>
      {/* Multi-vehicle chip selector */}
      {mappedVehicles.length > 1 && (
        <View style={styles.selectorWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            {mappedVehicles.map((vehicle, index) => {
              const isSelected = index === selectedIndex;
              return (
                <TouchableOpacity
                  key={vehicle.id || index}
                  onPress={() => handleChipPress(index)}
                  style={[styles.chip, isSelected && styles.activeChip]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.activeChipText,
                    ]}
                  >
                    {vehicle.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Value-prop banner — why adding vehicle info matters */}
      <VehicleBenefitsBanner />

      {/* Rich hero card */}
      <VehicleDetailHero vehicle={selectedVehicle} />

      {/* Tyre configuration panel */}
      <TirePressureRow
        front={selectedVehicle.pressureFront}
        rear={selectedVehicle.pressureRear}
        alloyType={selectedVehicle.alloyType}
        isCalibrated={selectedVehicle.isCalibrated}
      />

      <SectionHeader title="Maintenance & Renewals" />

      {selectedVehicle.maintenance.map(item => (
        <MaintenanceCard
          key={item.id}
          category={item.category}
          title={item.title}
          metaLabel={item.metaLabel}
          metaValue={item.metaValue}
          metaVariant={item.metaVariant}
          accentColor={item.accentColor}
          icon={MAINTENANCE_ICONS[item.iconKey](item.accentColor)}
        />
      ))}

      <View style={styles.actionFooter}>
        {/* Edit button — only shown when a vehicle exists */}
        {onEditPress && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.85}
          >
            <Pencil size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.editButtonText}>Edit Vehicle Details</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.addVehicleButton}
          onPress={() => navigation.navigate('AddVehicle')}
          activeOpacity={0.7}
        >
          <Plus size={16} color="#111827" strokeWidth={2.5} />
          <Text style={styles.addVehicleText}>Add New Vehicle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  addFirstButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  selectorWrapper: { marginBottom: 12 },
  chipContainer: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  activeChip: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  activeChipText: { color: '#FFFFFF' },
  actionFooter: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 80,
    gap: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
  },
  editButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
  },
  addVehicleText: { fontSize: 14, fontWeight: '600', color: '#111827' },
});
