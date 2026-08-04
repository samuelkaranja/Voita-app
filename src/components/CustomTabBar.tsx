import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  Home,
  Wrench,
  ShoppingCart,
  Users,
  ShieldCheck,
  FileText,
  User,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { generatePath } from '../utils/tabBarPath';

const { width } = Dimensions.get('window');

const icons: any = {
  Home: Home,
  Services: Wrench,
  Marketplace: ShoppingCart,
  Community: Users,
  Insurance: ShieldCheck,
  Claims: FileText,
  Profile: User,
};

// Tab bar layout constants — kept in one place so anything
// positioning UI above the tab bar can stay in sync automatically.
const TAB_ICON_ROW_HEIGHT = 65;
const ACTIVE_CIRCLE_RISE = 35; // activeCircle's `top: -35`
const ACTIVE_CIRCLE_RADIUS = 25; // half of activeCircle's 50px size
const CLEARANCE_MARGIN = 15; // breathing room above the circle

export function useTabBarClearance() {
  const insets = useSafeAreaInsets();
  return (
    TAB_ICON_ROW_HEIGHT +
    insets.bottom +
    15 +
    ACTIVE_CIRCLE_RISE +
    ACTIVE_CIRCLE_RADIUS +
    CLEARANCE_MARGIN
  );
}

// 1. Extracted Tab Item to legally use Hooks safely per-tab
function TabItem({ route, isFocused, onPress }: any) {
  const Icon = icons[route.name];
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0);
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      key={route.key}
      style={styles.tab}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        {/* We keep a structural container so the Text label stays in place */}
        <View style={styles.iconContainer}>
          {isFocused ? (
            <Animated.View style={[styles.activeCircle, animatedStyle]}>
              <Icon size={22} color="#fff" />
            </Animated.View>
          ) : (
            <Icon size={22} color="#999" />
          )}
        </View>

        <Text style={[styles.label, { color: isFocused ? '#0d2b1f' : '#999' }]}>
          {route.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({ state, navigation, descriptors }: any) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;
  const totalHeight = TAB_ICON_ROW_HEIGHT + insets.bottom + 15; // icon row + safe area + original design margin, counted once

  if (focusedOptions.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View style={[styles.wrapper, { height: totalHeight }]}>
      <Svg width={width} height={totalHeight} style={styles.svg}>
        <Path
          d={generatePath(width, totalHeight, tabWidth, state.index)}
          fill="#F5F5F5"
        />
      </Svg>

      <View
        style={[
          styles.tabs,
          { height: totalHeight, paddingBottom: insets.bottom + 15 },
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0, // Ensures width spans the whole screen
    right: 0, // Ensures width spans the whole screen
    width: width, // Explicit fallback width
    backgroundColor: 'transparent',
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
  tabs: {
    flexDirection: 'row',
    height: 65,
    width: width, // Match screen width perfectly
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    //height: '100%',
  },
  iconContainer: {
    height: 20, // Fixed height space so things don't jump when switching
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  activeCircle: {
    position: 'absolute',
    top: -ACTIVE_CIRCLE_RISE,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0d2b1f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
