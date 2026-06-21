import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { SkillCard, SkillEntry } from './SkillCard';

interface CertifiedSkillsSectionProps {
  skills: SkillEntry[];
}

export const CertifiedSkillsSection: React.FC<CertifiedSkillsSectionProps> = ({
  skills,
}) => {
  // Pair skills into rows of 2; last item goes full width if odd count
  const rows: SkillEntry[][] = [];
  for (let i = 0; i < skills.length; i += 2) {
    if (i + 1 < skills.length) {
      rows.push([skills[i], skills[i + 1]]);
    } else {
      rows.push([{ ...skills[i], fullWidth: true }]);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Certified Skills</Text>
        <View style={styles.certBadge}>
          <ShieldCheck size={12} color="#10B981" strokeWidth={2.5} />
          <Text style={styles.certText}>Voita Certified</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) =>
          row.length === 1 ? (
            <SkillCard key={row[0].id} item={row[0]} />
          ) : (
            <View key={rowIndex} style={styles.row}>
              {row.map(skill => (
                <SkillCard key={skill.id} item={skill} />
              ))}
            </View>
          ),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  certText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
