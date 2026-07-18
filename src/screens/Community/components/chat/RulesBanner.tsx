import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Shield } from 'lucide-react-native';
import { colors } from '../../../../theme/colors';

export default function RulesBanner({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <Shield size={14} color={colors.warning} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warningBackground,
    paddingVertical: 10,
  },
  text: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
});
