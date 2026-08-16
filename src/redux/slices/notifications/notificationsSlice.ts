import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../api/client';
import { extractError } from '../../../api/errors';

// Debug helpers

const debugRequest = (name: string, config: any) => {
  if (__DEV__) {
    console.log(`\n🔵 [${name}] REQUEST:`, JSON.stringify(config, null, 2));
  }
};
const debugResponse = (name: string, data: any) => {
  if (__DEV__) {
    console.log(`\n🟢 [${name}] RESPONSE:`, JSON.stringify(data, null, 2));
  }
};
const debugError = (name: string, err: any) => {
  if (__DEV__) {
    console.log(`\n🔴 [${name}] ERROR:`, {
      status: err.response?.status,
      detail: err.response?.data,
      message: err.message,
      url: err.config?.url,
      headers: err.config?.headers,
    });
  }
};

// Types

export interface FCMTokenRecord {
  id: string;
  platform: string;
  device_name: string | null;
  is_active: boolean;
  created_at: string;
}

interface NotificationsState {
  fcmToken: string | null;
  tokens: FCMTokenRecord[];
  loading: {
    register: boolean;
    tokens: boolean;
  };
  error: string | null;
}

const initialState: NotificationsState = {
  fcmToken: null,
  tokens: [],
  loading: {
    register: false,
    tokens: false,
  },
  error: null,
};

// REGISTER TOKEN

export const registerFCMToken = createAsyncThunk(
  'notifications/registerToken',
  async (
    data: { fcm_token: string; platform: string; device_name?: string },
    { rejectWithValue },
  ) => {
    try {
      debugRequest('registerFCMToken', {
        url: '/api/v1/notifications/register-token',
        data,
      });
      const res = await api.post('/api/v1/notifications/register-token', data);
      debugResponse('registerFCMToken', res.data);
      return { ...res.data, fcm_token: data.fcm_token };
    } catch (err: any) {
      debugError('registerFCMToken', err);
      return rejectWithValue(extractError(err));
    }
  },
);

// GET MY TOKENS

export const fetchMyTokens = createAsyncThunk(
  'notifications/fetchMyTokens',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/v1/notifications/my-tokens');
      return res.data.tokens as FCMTokenRecord[]; // ← unwrap .tokens
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

// DELETE TOKEN

export const deleteFCMToken = createAsyncThunk(
  'notifications/deleteToken',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/notifications/tokens/${tokenId}`);
      return tokenId;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

// SLICE

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLocalFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    clearNotificationsError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Register token
      .addCase(registerFCMToken.pending, state => {
        state.loading.register = true;
      })
      .addCase(registerFCMToken.fulfilled, (state, action) => {
        state.loading.register = false;
        state.fcmToken = action.payload.fcm_token;
      })
      .addCase(registerFCMToken.rejected, (state, action) => {
        state.loading.register = false;
        if (action.payload !== 'Not authenticated') {
          state.error = action.payload as string;
        }
      })

      // Fetch my tokens
      .addCase(fetchMyTokens.pending, state => {
        state.loading.tokens = true;
      })
      .addCase(fetchMyTokens.fulfilled, (state, action) => {
        state.loading.tokens = false;
        state.tokens = action.payload;
      })
      .addCase(fetchMyTokens.rejected, (state, action) => {
        state.loading.tokens = false;
        if (action.payload !== 'Not authenticated') {
          state.error = action.payload as string;
        }
      })

      // Delete token
      .addCase(deleteFCMToken.fulfilled, (state, action) => {
        state.tokens = state.tokens.filter(t => t.id !== action.payload);
      });
  },
});

export const { setLocalFcmToken, clearNotificationsError } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
