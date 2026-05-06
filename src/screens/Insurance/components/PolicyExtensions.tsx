import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Users, Package, CloudRain, Settings, Cog } from 'lucide-react-native';

const items = [
  { name: 'Passengers', icon: Users },
  { name: 'Goods', icon: Package },
  { name: 'Floods', icon: CloudRain },
  { name: 'Engine Core', icon: Settings },
  { name: 'Gear Box', icon: Cog },
];

export default function PolicyExtensions() {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Policy Extensions</Text>
        <View style={styles.line}></View>
      </View>

      <View style={styles.grid}>
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <Pressable
              key={index}
              style={({ pressed, hovered }) => [
                styles.card,
                (pressed || hovered) && styles.cardHover,
              ]}
            >
              <Icon size={26} color="#006c52" style={{ marginBottom: 10 }} />
              <Text style={styles.text}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 70,
  },
  head: {
    marginBottom: 40,
  },
  title: {
    color: '#001810',
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
  },
  line: {
    width: 80,
    height: 4,
    backgroundColor: '#006c52',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '45%',
    backgroundColor: '#f1f4f2',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardHover: {
    backgroundColor: '#8ff6d0',
  },
  text: {
    marginTop: 6,
    color: '#001810',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
