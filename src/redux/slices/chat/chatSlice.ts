// src/store/slices/chat/chatSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { ChatMessage, ChatRoomDetail } from '../../../types/chat';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1';

const debugRequest = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[chat] → ${label}`, data ?? '');
};
const debugResponse = (label: string, data?: unknown) => {
  if (__DEV__) console.log(`[chat] ← ${label}`, data ?? '');
};
const debugError = (label: string, error: unknown) => {
  if (__DEV__) console.log(`[chat] ✕ ${label}`, error);
};
const extractError = (error: any): string =>
  error?.response?.data?.detail || error?.message || 'Something went wrong';

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
  async (roomId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    try {
      debugRequest('GET /community/rooms/{id}/messages/', { roomId });
      const res = await axios.get(
        `${BASE_URL}/community/rooms/${roomId}/messages/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      debugResponse('GET /community/rooms/{id}/messages/', res.data);
      return res.data as ChatRoomDetail;
    } catch (error) {
      debugError('GET /community/rooms/{id}/messages/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

export const sendTextMessage = createAsyncThunk(
  'chat/sendTextMessage',
  async (
    { roomId, text }: { roomId: string; text: string },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as RootState).auth.token;
    try {
      debugRequest('POST /community/rooms/{id}/messages/', { roomId, text });
      const res = await axios.post(
        `${BASE_URL}/community/rooms/${roomId}/messages/`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      debugResponse('POST /community/rooms/{id}/messages/', res.data);
      return { roomId, message: res.data as ChatMessage };
    } catch (error) {
      debugError('POST /community/rooms/{id}/messages/', error);
      return rejectWithValue(extractError(error));
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRoomMessages.pending, state => {
        state.isLoadingMessages = true;
      })
      .addCase(
        fetchRoomMessages.fulfilled,
        (state, action: PayloadAction<ChatRoomDetail>) => {
          state.isLoadingMessages = false;
          state.roomsById[action.payload.id] = action.payload;
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

export default chatSlice.reducer;
