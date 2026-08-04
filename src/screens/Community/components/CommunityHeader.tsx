import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { colors } from '../../../theme/colors';

interface CommunityHeaderProps {
  title?: string;
  onSearchPress?: () => void;
  showBackButton?: boolean;
}

export default function CommunityHeader({
  title = 'Community Chats',
  onSearchPress,
  showBackButton = true,
}: CommunityHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      {showBackButton ? (
        <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
          <ArrowLeft size={24} color={colors.headerText} />
        </Pressable>
      ) : (
        <View style={styles.headerSpacer} />
      )}
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onSearchPress} hitSlop={12}>
        <Search size={22} color={colors.headerText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.headerBackground,
  },
  headerSpacer: { width: 24 },
  title: { color: colors.headerText, fontSize: 20, fontWeight: '700' },
});
