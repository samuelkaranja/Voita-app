import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ShieldCheck, Search } from 'lucide-react-native';

interface ScoutFilter {
  id: string;
  label: string;
}

interface ScoutHeroBannerProps {
  search: string;
  onSearchChange: (text: string) => void;
  filters: ScoutFilter[];
  activeFilter: string;
  onFilterPress: (id: string) => void;
}

export const ScoutHeroBanner: React.FC<ScoutHeroBannerProps> = ({
  search,
  onSearchChange,
  filters,
  activeFilter,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Eyebrow */}
      <View style={styles.eyebrow}>
        <ShieldCheck size={13} color="#10B981" strokeWidth={2.5} />
        <Text style={styles.eyebrowText}>SCOUT HUB</Text>
      </View>

      {/* Headline */}
      <Text style={styles.headline}>Find Your Expert Scout</Text>
      <Text style={styles.subtitle}>
        Instant access to vetted drivers, price auditors, and valet experts.
        Consolidated intelligence for your automotive journey.
      </Text>

      {/* Search */}
      <View style={styles.searchBar}>
        <Search size={16} color="#9CA3AF" strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search by name or expertise..."
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, f.id === activeFilter && styles.chipActive]}
            onPress={() => onFilterPress(f.id)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.chipText,
                f.id === activeFilter && styles.chipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 1,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  filtersRow: {
    gap: 8,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
