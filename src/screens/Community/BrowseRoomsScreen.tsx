import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';

import { BrowseRoom } from '../../types/community';
import { colors } from '../../theme/colors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import CommunityHeader from './components/CommunityHeader';
import PendingRequestsStrip from './components/PendingRequestsStrip';
import RoomGridCard from './components/RoomGridCard';
import {
  fetchBrowseRooms,
  requestJoinRoom,
} from '../../redux/slices/community/communitySlice';
import { CommunityStackParamList } from '../../navigation/CommunityStack';

type NavProp = NativeStackNavigationProp<
  CommunityStackParamList,
  'BrowseRooms'
>;

export default function BrowseRoomsScreen() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');

  const { browseRooms, pendingRequests, isLoadingBrowse, joiningRoomId } =
    useAppSelector(state => state.community);

  useEffect(() => {
    dispatch(fetchBrowseRooms());
  }, [dispatch]);

  const handleJoin = useCallback(
    (roomId: string) => dispatch(requestJoinRoom(roomId)),
    [dispatch],
  );

  const handleOpen = useCallback(
    (room: BrowseRoom) =>
      navigation.navigate('ChatRoom', { roomId: room.id, roomName: room.name }),
    [navigation],
  );

  const filteredRooms = browseRooms.filter((room: { name: string }) =>
    room.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <CommunityHeader title="Community" />

      <View style={styles.intro}>
        <Text style={styles.title}>Browse Chat Rooms</Text>
        <Text style={styles.subtitle}>
          Connect with fellow owners and enthusiasts in brand-specific channels.
        </Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by brand name..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <PendingRequestsStrip requests={pendingRequests} />

      {isLoadingBrowse && browseRooms.length === 0 ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={room => room.id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <RoomGridCard
              room={item}
              onJoin={handleJoin}
              onOpen={handleOpen}
              isJoining={joiningRoomId === item.id}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  intro: { paddingHorizontal: 16, marginTop: 12 },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  gridContent: { paddingHorizontal: 10, paddingTop: 16, paddingBottom: 100 },
});
