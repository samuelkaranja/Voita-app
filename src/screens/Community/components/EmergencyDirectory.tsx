import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ShieldAlert,
  ChevronRight,
  Car,
  Construction,
  HeartPulse,
  LucideIcon,
} from 'lucide-react-native';

type ContactRowProps = {
  Icon: LucideIcon;
  title: string;
  sub: string;
  iconColor: string;
  bgColor: string;
};

const ContactRow = ({
  Icon,
  title,
  sub,
  iconColor,
  bgColor,
}: ContactRowProps) => (
  <TouchableOpacity style={styles.row}>
    <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
      <Icon color={iconColor} size={20} />
    </View>
    <View style={styles.textGroup}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSub}>{sub}</Text>
    </View>
    <ChevronRight color="#CBD5E1" size={20} />
  </TouchableOpacity>
);

export default function EmergencyDirectory() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.accentBar} />
        <View style={styles.header}>
          <ShieldAlert color="#ef4444" size={24} />
          <Text style={styles.headerText}>Help Contacts Directory</Text>
        </View>

        <ContactRow
          Icon={ShieldAlert}
          iconColor="#ef4444"
          bgColor="#fee2e2"
          title="National Police"
          sub="999 / 112"
        />
        <ContactRow
          Icon={Car}
          iconColor="#10b981"
          bgColor="#d1fae5"
          title="NTSA Hotline"
          sub="0709 932 000"
        />
        <ContactRow
          Icon={Construction}
          iconColor="#3b82f6"
          bgColor="#dbeafe"
          title="KeNHA Support"
          sub="1511"
        />
        <ContactRow
          Icon={HeartPulse}
          iconColor="#f59e0b"
          bgColor="#fef3c7"
          title="Red Cross"
          sub="0700 000 999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc', // Subtle light grey background for the screen
    paddingTop: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 40,
    bottom: 40,
    width: 4,
    backgroundColor: '#ef4444',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroup: {
    flex: 1,
    marginLeft: 15,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  rowSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
