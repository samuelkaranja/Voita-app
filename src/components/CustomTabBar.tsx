import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Home, HandHelping, Users, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const icons: any = {
  Home: Home,
  Services: HandHelping,
  Community: Users,
  Profile: User,
};

const iconSizes: any = {
  Home: 20,
  Services: 28,
  Community: 20,
  Profile: 20,
};

// Tab bar layout constants — kept in one place so anything
// positioning UI above the tab bar can stay in sync automatically.
const BAR_HEIGHT = 67;
const BAR_BOTTOM_MARGIN = 16; // gap between the pill and the screen edge
const BAR_SIDE_MARGIN = 16;
const CLEARANCE_BUFFER = 12;

export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return BAR_HEIGHT + BAR_BOTTOM_MARGIN + insets.bottom + CLEARANCE_BUFFER;
}

// 1. Extracted Tab Item to legally use Hooks safely per-tab
function TabItem({ route, isFocused, onPress }: any) {
  const Icon = icons[route.name];
  const iconSize = iconSizes[route.name] ?? 20;
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, {
      damping: 15,
      stiffness: 160,
    });
  }, [isFocused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  return (
    <TouchableOpacity
      key={route.key}
      style={styles.tab}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.activePill, pillStyle]} />
        <Icon size={iconSize} color={isFocused ? '#0d2b1f' : '#9AA5A0'} />
      </View>

      <Text style={[styles.label, isFocused && styles.labelActive]}>
        {route.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, navigation, descriptors }: any) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();

  if (focusedOptions.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + BAR_BOTTOM_MARGIN,
          left: BAR_SIDE_MARGIN,
          right: BAR_SIDE_MARGIN,
          height: BAR_HEIGHT,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 40,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCEAE1',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    color: '#9AA5A0',
    textAlign: 'center',
  },
  labelActive: {
    color: '#0d2b1f',
    fontWeight: '600',
  },
});
