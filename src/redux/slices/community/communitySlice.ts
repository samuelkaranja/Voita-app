import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../api/client';
import { extractError } from '../../../api/errors';
import {
  BrowseRoom,
  CommunityRoom,
  PendingRequest,
} from '../../../types/community';

const debugRequest = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[community] → ${label}`, data ?? '');
};
const debugResponse = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[community] ← ${label}`, data ?? '');
};
const debugError = (label: string, error: unknown) => {
  if (__DEV__) console.log(`[community] ✕ ${label}`, error);
};

const mapCommunityRoom = (room: any): CommunityRoom => ({
  id: room.id,
  name: room.name,
  memberCount: room.memberCount,
  onlineCount: room.onlineCount,
  lastMessage: room.lastMessage,
  lastMessageTime: room.lastMessageTimestamp ?? room.lastMessageTime,
  unreadCount: room.unreadCount,
  iconUrl: room.iconUrl,
});

interface CommunityState {
  generalRooms: CommunityRoom[];
  brandRooms: CommunityRoom[];
  pendingRequests: PendingRequest[];
  browseRooms: BrowseRoom[];
  isLoadingRooms: boolean;
  isLoadingBrowse: boolean;
  joiningRoomId: string | null;
  error: string | null;
}

const initialState: CommunityState = {
  generalRooms: [],
  brandRooms: [],
  pendingRequests: [],
  browseRooms: [],
  isLoadingRooms: false,
  isLoadingBrowse: false,
  joiningRoomId: null,
  error: null,
};

export const fetchCommunityRooms = createAsyncThunk(
  'community/fetchCommunityRooms',
  async (_, { rejectWithValue }) => {
    try {
      debugRequest('GET /api/v1/community/rooms/');
      // Switched to api instance — handles tokens and refresh transparently
      const res = await api.get('/api/v1/community/rooms/');
      debugResponse('GET /api/v1/community/rooms/', res.data);

      return {
        general: (res.data.general ?? []).map(mapCommunityRoom),
        brandRooms: (res.data.brandRooms ?? []).map(mapCommunityRoom),
        pendingRequests: res.data.pendingRequests ?? [],
      };
    } catch (error) {
      debugError('GET /api/v1/community/rooms/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

export const fetchBrowseRooms = createAsyncThunk(
  'community/fetchBrowseRooms',
  async (_, { rejectWithValue }) => {
    try {
      debugRequest('GET /api/v1/community/rooms/browse/');
      const res = await api.get('/api/v1/community/rooms/browse/');
      debugResponse('GET /api/v1/community/rooms/browse/', res.data);
      return res.data as BrowseRoom[];
    } catch (error) {
      debugError('GET /api/v1/community/rooms/browse/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

export const requestJoinRoom = createAsyncThunk(
  'community/requestJoinRoom',
  async (roomId: string, { rejectWithValue }) => {
    try {
      debugRequest('POST /api/v1/community/rooms/{id}/join', { roomId });
      const res = await api.post(`/api/v1/community/rooms/${roomId}/join`, {});
      debugResponse('POST /api/v1/community/rooms/{id}/join', res.data);
      return res.data as {
        roomId: string;
        roomName: string;
        requestedAt: string;
      };
    } catch (error) {
      debugError('POST /api/v1/community/rooms/{id}/join', error);
      return rejectWithValue(extractError(error));
    }
  },
);

export const cancelJoinRequest = createAsyncThunk(
  'community/cancelJoinRequest',
  async (roomId: string, { rejectWithValue }) => {
    try {
      debugRequest('DELETE /api/v1/community/rooms/{id}/join', { roomId });
      await api.delete(`/api/v1/community/rooms/${roomId}/join`);
      debugResponse('DELETE /api/v1/community/rooms/{id}/join', { roomId });
      return roomId;
    } catch (error) {
      debugError('DELETE /api/v1/community/rooms/{id}/join', error);
      return rejectWithValue(extractError(error));
    }
  },
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearCommunityError(state) {
      state.error = null;
    },
    markRoomJoined(state, action: PayloadAction<string>) {
      const roomId = action.payload;

      // Drop it from pending requests
      state.pendingRequests = state.pendingRequests.filter(
        r => r.roomId !== roomId,
      );

      // Reflect the new status in browseRooms if it's still loaded there
      state.browseRooms = state.browseRooms.map(room =>
        room.id === roomId
          ? { ...room, status: 'joined', requestedAt: undefined }
          : room,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCommunityRooms.pending, state => {
        state.isLoadingRooms = true;
        state.error = null;
      })
      .addCase(
        fetchCommunityRooms.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoadingRooms = false;
          state.generalRooms = action.payload.general ?? [];
          state.brandRooms = action.payload.brandRooms ?? [];
          state.pendingRequests = action.payload.pendingRequests ?? [];
        },
      )
      .addCase(fetchCommunityRooms.rejected, (state, action) => {
        state.isLoadingRooms = false;
        state.error = action.payload as string;
      })

      .addCase(fetchBrowseRooms.pending, state => {
        state.isLoadingBrowse = true;
        state.error = null;
      })
      .addCase(
        fetchBrowseRooms.fulfilled,
        (state, action: PayloadAction<BrowseRoom[]>) => {
          state.isLoadingBrowse = false;
          state.browseRooms = action.payload;
        },
      )
      .addCase(fetchBrowseRooms.rejected, (state, action) => {
        state.isLoadingBrowse = false;
        state.error = action.payload as string;
      })

      .addCase(requestJoinRoom.pending, (state, action) => {
        state.joiningRoomId = action.meta.arg;
      })
      .addCase(requestJoinRoom.fulfilled, (state, action) => {
        state.joiningRoomId = null;
        const { roomId, roomName, requestedAt } = action.payload;

        state.browseRooms = state.browseRooms.map(room =>
          room.id === roomId
            ? { ...room, status: 'pending', requestedAt }
            : room,
        );

        state.pendingRequests.push({
          id: `${roomId}-pending`,
          roomId,
          roomName,
          requestedAt,
        });
      })
      .addCase(requestJoinRoom.rejected, (state, action) => {
        state.joiningRoomId = null;
        state.error = action.payload as string;
      })

      .addCase(
        cancelJoinRequest.fulfilled,
        (state, action: PayloadAction<string>) => {
          const roomId = action.payload;
          state.pendingRequests = state.pendingRequests.filter(
            r => r.roomId !== roomId,
          );
          state.browseRooms = state.browseRooms.map(room =>
            room.id === roomId
              ? { ...room, status: 'available', requestedAt: undefined }
              : room,
          );
        },
      );
  },
});

export const { clearCommunityError, markRoomJoined } = communitySlice.actions;
export default communitySlice.reducer;
