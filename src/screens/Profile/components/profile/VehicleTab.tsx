import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Linking,
} from 'react-native';
import {
  Zap,
  Gauge,
  Shield,
  IdCard,
  Wrench,
  GitFork,
  Plus,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionHeader } from './SectionHeader';
import { VehicleHeroCard } from './VehicleHeroCard';
import { MaintenanceCard } from './MaintenanceCard';
import { ProfileStackParamList } from '../../../../navigation/ProfileStack';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

export interface VehicleInfo {
  color: string;
  modelYear: string;
  imageUri?: string;
  label: string;
  plateNumber: string;
  fuelType: string;
  tirePressure: string;
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
  vehicleInfo: VehicleInfo;
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

// Action handlers per maintenance type
const MAINTENANCE_ACTIONS: Record<
  MaintenanceItem['iconKey'],
  (navigation: NavProp) => void
> = {
  insurance: () => Linking.openURL('https://voita.com/renew/insurance'),
  license: () => Linking.openURL('https://voita.com/renew/license'),
  service: nav => nav.navigate('BookService' as any),
  tires: nav => nav.navigate('BookService' as any),
};

export const VehicleTab: React.FC<Props> = ({ vehicleInfo }) => {
  const navigation = useNavigation<NavProp>();

  if (!vehicleInfo) return null;

  const stats = [
    {
      icon: <Zap size={18} color="#111827" strokeWidth={2} />,
      label: 'Fuel Type',
      value: vehicleInfo.fuelType,
    },
    {
      icon: <Gauge size={18} color="#111827" strokeWidth={2} />,
      label: 'Pressure',
      value: vehicleInfo.tirePressure,
    },
  ];

  return (
    <View>
      <VehicleHeroCard
        imageUri={vehicleInfo.imageUri}
        vehicleLabel={vehicleInfo.label}
        modelYear={vehicleInfo.modelYear}
        color={vehicleInfo.color}
        plateNumber={vehicleInfo.plateNumber}
        stats={stats}
      />

      <SectionHeader title="Maintenance & Renewals" />

      {vehicleInfo.maintenance.map(item => (
        <MaintenanceCard
          key={item.id}
          category={item.category}
          title={item.title}
          metaLabel={item.metaLabel}
          metaValue={item.metaValue}
          metaVariant={item.metaVariant}
          accentColor={item.accentColor}
          icon={MAINTENANCE_ICONS[item.iconKey](item.accentColor)}
          onActionPress={() => MAINTENANCE_ACTIONS[item.iconKey](navigation)}
        />
      ))}

      {/* Add New Vehicle */}
      <TouchableOpacity
        style={styles.addVehicleButton}
        onPress={() => navigation.navigate('AddVehicle')}
        activeOpacity={0.7}
      >
        <Plus size={16} color="#111827" strokeWidth={2.5} />
        <Text style={styles.addVehicleText}>Add New Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addVehicleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
  },
  addVehicleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
