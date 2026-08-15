import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '../../../theme/ResetPassword/colors';

interface IconBadgeProps {
  icon: LucideIcon;
  size?: number;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon: Icon,
  size = 96,
}) => {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Icon size={size * 0.36} color={colors.brandGreen} strokeWidth={1.75} />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.iconBadgeBackground,
    alignSelf: 'center',
  },
});
