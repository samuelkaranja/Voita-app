import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Wrench,
  Paintbrush,
  Sofa,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react-native';

function ServiceCard({ icon, title, subtitle, onPress }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {icon}
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function MarketplaceServices({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Featured Card */}
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => navigation.navigate('EliteMechanics')}
      >
        <View>
          <Wrench size={24} color="#7FE3C5" />
          <Text style={styles.featuredTitle}>Elite Mechanics</Text>
          <Text style={styles.featuredSubtitle}>
            Precision diagnostics & repair
          </Text>
          <Text style={styles.featuredMeta}>142 PARTNERS</Text>
        </View>

        <ArrowRight size={20} color="#7FE3C5" />
      </TouchableOpacity>

      {/* 🔹 Grid */}
      <View style={styles.grid}>
        <ServiceCard
          icon={<Paintbrush size={24} color="#006c52" />}
          title="Paint & Body"
          subtitle="VERIFIED FINISH"
          onPress={() => navigation.navigate('Paint')}
        />

        <ServiceCard
          icon={<Sofa size={24} color="#006c52" />}
          title="Upholstery"
          subtitle="CUSTOM CRAFT"
          onPress={() => navigation.navigate('Upholstery')}
        />

        <ServiceCard
          icon={<Sparkles size={24} color="#006c52" />}
          title="Detailing"
          subtitle="ECO-CONSCIOUS"
          onPress={() => navigation.navigate('Detailing')}
        />

        <ServiceCard
          icon={<GraduationCap size={24} color="#006c52" />}
          title="Driving Schools"
          subtitle="SAFE JOURNEY"
          onPress={() => navigation.navigate('DrivingSchools')}
        />
      </View>

      {/* 🔹 Bottom Banner */}
      <TouchableOpacity
        style={styles.banner}
        onPress={() => navigation.navigate('EzraFastTrack')}
      >
        <View>
          <Text style={styles.bannerTitle}>Fast-Track</Text>
          <Text style={styles.bannerSubtitle}>
            Instant claim processing with partners
          </Text>
        </View>

        <ShieldCheck size={20} color="#D1FAE5" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 20,
  },

  /* Featured */
  featuredCard: {
    backgroundColor: '#062E22',
    borderRadius: 18,
    paddingHorizontal: 30,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  featuredTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#D1FAE5',
  },

  featuredSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#A7F3D0',
  },

  featuredMeta: {
    marginTop: 8,
    fontSize: 12,
    color: '#7FE3C5',
    fontWeight: '600',
  },

  /* 🔹 Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  card: {
    width: '48%',
    backgroundColor: '#e6e9e7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  cardTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#001810',
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 10,
    color: '#717974',
  },

  /* 🔹 Bottom Banner */
  banner: {
    marginTop: 6,
    backgroundColor: '#006c52',
    borderRadius: 16,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ECFEFF',
  },

  bannerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#8ff6d0cc',
  },
});
