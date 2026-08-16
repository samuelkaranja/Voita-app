import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../../api/client';
import { extractError } from '../../../api/errors';
import { ChatMessage, ChatRoomDetail } from '../../../types/chat';

const debugRequest = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[chat] → ${label}`, data ?? '');
};
const debugResponse = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[chat] ← ${label}`, data ?? '');
};
const debugError = (label: string, error: unknown) => {
  if (__DEV__) console.log(`[chat] ✕ ${label}`, error);
};

interface ChatState {
  roomsById: Record<string, ChatRoomDetail>;
  isLoadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  roomsById: {},
  isLoadingMessages: false,
  error: null,
};

export const fetchRoomMessages = createAsyncThunk(
  'chat/fetchRoomMessages',
  async (roomId: string, { rejectWithValue }) => {
    try {
      debugRequest('GET /api/v1/community/rooms/{id}/messages/', { roomId });
      const res = await api.get(`/api/v1/community/rooms/${roomId}/messages/`);
      debugResponse('GET /api/v1/community/rooms/{id}/messages/', res.data);
      return res.data as ChatRoomDetail;
    } catch (error) {
      debugError('GET /api/v1/community/rooms/{id}/messages/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

export const sendTextMessage = createAsyncThunk(
  'chat/sendTextMessage',
  async (
    { roomId, text }: { roomId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      debugRequest('POST /api/v1/community/rooms/{id}/messages/', {
        roomId,
        text,
      });
      const res = await api.post(
        `/api/v1/community/rooms/${roomId}/messages/`,
        { text },
      );
      debugResponse('POST /api/v1/community/rooms/{id}/messages/', res.data);
      return { roomId, message: res.data as ChatMessage };
    } catch (error) {
      debugError('POST /api/v1/community/rooms/{id}/messages/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    seedRoomMeta(
      state,
      action: PayloadAction<{
        roomId: string;
        roomName: string;
        memberCount?: number;
        avatarUrl?: string;
      }>,
    ) {
      const { roomId, roomName, memberCount, avatarUrl } = action.payload;
      const existing = state.roomsById[roomId];
      state.roomsById[roomId] = {
        ...(existing ?? { id: roomId, messages: [] }),
        name: existing?.name ?? roomName,
        memberCount: memberCount ?? existing?.memberCount,
        avatarUrl: avatarUrl ?? existing?.avatarUrl,
      } as ChatRoomDetail;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRoomMessages.pending, state => {
        state.isLoadingMessages = true;
      })
      .addCase(
        fetchRoomMessages.fulfilled,
        (state, action: PayloadAction<ChatRoomDetail>) => {
          state.isLoadingMessages = false;
          const existing = state.roomsById[action.payload.id];
          state.roomsById[action.payload.id] = {
            ...existing,
            ...action.payload,
            memberCount: action.payload.memberCount ?? existing?.memberCount,
            avatarUrl: action.payload.avatarUrl ?? existing?.avatarUrl,
          };
        },
      )
      .addCase(fetchRoomMessages.rejected, (state, action) => {
        state.isLoadingMessages = false;
        state.error = action.payload as string;
      })
      .addCase(sendTextMessage.fulfilled, (state, action) => {
        const { roomId, message } = action.payload;
        state.roomsById[roomId]?.messages.push(message);
      });
  },
});

export const { seedRoomMeta } = chatSlice.actions;
export default chatSlice.reducer;
