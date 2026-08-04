import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CommunityRoom, PendingRequest } from '../../types/community';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import CommunityHeader from './components/CommunityHeader';
import SectionHeader from './components/SectionHeader';
import GeneralRoomCard from './components/GeneralRoomCard';
import BrandRoomCard from './components/BrandRoomCard';
import PendingRequestCard from './components/PendingRequestCard';
import BrowseAllRoomsCTA from './components/BrowseAllRoomsCTA';
import {
  cancelJoinRequest,
  fetchCommunityRooms,
} from '../../redux/slices/community/communitySlice';
import { CommunityStackParamList } from '../../navigation/CommunityStack';

type NavProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'CommunityRooms'
>;

// Sections are flattened into one FlatList so header labels, room rows,
// pending requests, and the CTA all share a single scroll + spacing rhythm.
type ListItem =
  | { kind: 'sectionHeader'; id: string; title: string }
  | { kind: 'generalRoom'; id: string; room: CommunityRoom }
  | { kind: 'brandRoom'; id: string; room: CommunityRoom }
  | { kind: 'pendingRequest'; id: string; request: PendingRequest }
  | { kind: 'browseCta'; id: string };

export default function CommunityScreen() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { generalRooms, brandRooms, pendingRequests, isLoadingRooms } =
    useAppSelector(state => state.community);

  useEffect(() => {
    dispatch(fetchCommunityRooms());
  }, [dispatch]);

  const openRoom = useCallback(
    (room: CommunityRoom) => {
      navigation.navigate('ChatRoom', {
        roomId: room.id,
        roomName: room.name,
        memberCount: room.memberCount,
        avatarUrl: room.iconUrl,
      });
    },
    [navigation],
  );

  const handleCancel = useCallback(
    (roomId: string) => {
      dispatch(cancelJoinRequest(roomId));
    },
    [dispatch],
  );

  const goToBrowse = useCallback(() => {
    navigation.navigate('BrowseRooms');
  }, [navigation]);

  if (isLoadingRooms && generalRooms.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!isLoadingRooms && generalRooms.length === 0 && brandRooms.length === 0) {
    return (
      <View style={styles.container}>
        <CommunityHeader onSearchPress={() => {}} showBackButton={false} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No rooms yet</Text>
          <Text style={styles.emptySubtitle}>
            Check back soon, or browse brand communities to join one.
          </Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => navigation.navigate('BrowseRooms')}
          >
            <Text style={styles.emptyButtonText}>Browse All Rooms</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const items: ListItem[] = [
    { kind: 'sectionHeader', id: 'h-general', title: 'General' },
    ...generalRooms.map(room => ({
      kind: 'generalRoom' as const,
      id: room.id,
      room,
    })),

    ...(brandRooms.length > 0
      ? [
          {
            kind: 'sectionHeader' as const,
            id: 'h-brand',
            title: 'My Brand Rooms',
          },
          ...brandRooms.map(room => ({
            kind: 'brandRoom' as const,
            id: room.id,
            room,
          })),
        ]
      : []),

    ...(pendingRequests.length > 0
      ? [
          {
            kind: 'sectionHeader' as const,
            id: 'h-pending',
            title: `Pending Requests (${pendingRequests.length})`,
          },
          ...pendingRequests.map(request => ({
            kind: 'pendingRequest' as const,
            id: request.id,
            request,
          })),
        ]
      : []),

    { kind: 'browseCta', id: 'browse-cta' },
  ];

  return (
    <View style={styles.container}>
      <CommunityHeader onSearchPress={() => {}} showBackButton={false} />
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          switch (item.kind) {
            case 'sectionHeader':
              return <SectionHeader title={item.title} />;
            case 'generalRoom':
              return <GeneralRoomCard room={item.room} onPress={openRoom} />;
            case 'brandRoom':
              return <BrandRoomCard room={item.room} onPress={openRoom} />;
            case 'pendingRequest':
              return (
                <PendingRequestCard
                  request={item.request}
                  onCancel={handleCancel}
                />
              );
            case 'browseCta':
              return <BrowseAllRoomsCTA onPress={goToBrowse} />;
            default:
              return null;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: { paddingBottom: 100 },
});
