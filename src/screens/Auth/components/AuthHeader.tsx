import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../../theme/ResetPassword/colors';

interface AuthHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  logoAlign?: 'left' | 'center';
  /**
   * Text shown in the header (e.g. "VOITA", a screen name, or a step
   * label). Pass undefined or an empty string to render nothing — the
   * layout still reserves the space so the back button doesn't shift.
   */
  title?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  showBackButton = false,
  onBackPress,
  logoAlign = 'left',
  title,
}) => {
  const insets = useSafeAreaInsets();
  const hasTitle = Boolean(title && title.length > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {showBackButton ? (
        <Pressable
          onPress={onBackPress}
          style={styles.backButton}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}

      {hasTitle ? (
        <Text style={[styles.logo, logoAlign === 'left' && styles.logoLeft]}>
          {title}
        </Text>
      ) : (
        <View style={styles.titlePlaceholder} />
      )}

      {/* Balances the back button so a centered title stays centered */}
      {showBackButton && <View style={styles.backButtonPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.iconBadgeBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: { width: 40, height: 40 },
  titlePlaceholder: { flex: 1 },
  logo: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.textSecondary,
  },
  logoLeft: { textAlign: 'left' },
});
