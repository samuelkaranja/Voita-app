import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  phone: string | null;
  loading: {
    login: boolean;
    register: boolean;
    verifyOtp: boolean;
    sendOtp: boolean;
    init: boolean;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  phone: null,
  loading: {
    login: false,
    register: false,
    verifyOtp: false,
    sendOtp: false,
    init: true,
  },
};


// ✅ MAPPER FUNCTION (KEY FIX)
const mapDriverToUser = (driver: any): User => ({
  firstName: driver?.first_name ?? "",
  lastName: driver?.last_name ?? "",
  email: driver?.email ?? "",
  phone: driver?.phone ?? "",
  profileImageUrl: driver?.profile_image_url ?? null,
});


// 🔄 LOAD STORED AUTH
export const loadStoredAuth = createAsyncThunk(
  'auth/loadStoredAuth',
  async (_, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem('authData');

      if (!stored) return null;

      const { token, user, expiry } = JSON.parse(stored);

      if (Date.now() > expiry) {
        await AsyncStorage.removeItem('authData');
        return null;
      }

      return { token, user };
    } catch (err) {
      return rejectWithValue('Failed to load auth');
    }
  },
);


// 📝 REGISTER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/register`, {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      return { ...res.data, phone: data.phone };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Registration failed',
      );
    }
  },
);


// 📲 SEND OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/send-otp`, {
        phone,
        purpose: 'phone_verification',
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to send OTP',
      );
    }
  },
);


// ✅ VERIFY OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        phone,
        otp_code: otp,
        purpose: 'phone_verification',
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'OTP failed');
    }
  },
);


// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ phone, password }: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        phone,
        password,
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login failed');
    }
  },
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('authData');
    },
  },
  extraReducers: builder => {
    builder

      // 🔄 LOAD STORED AUTH
      .addCase(loadStoredAuth.pending, state => {
        state.loading.init = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.loading.init = false;

        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user; // ✅ restore user
        }
      })
      .addCase(loadStoredAuth.rejected, state => {
        state.loading.init = false;
      })


      // 📝 REGISTER
      .addCase(registerUser.pending, state => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading.register = false;
        state.phone = action.payload.phone;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.payload as string;
      })


      // 📲 SEND OTP
      .addCase(sendOtp.pending, state => {
        state.loading.sendOtp = true;
      })
      .addCase(sendOtp.fulfilled, state => {
        state.loading.sendOtp = false;
      })
      .addCase(sendOtp.rejected, state => {
        state.loading.sendOtp = false;
      })


      // ✅ VERIFY OTP
      .addCase(verifyOtp.pending, state => {
        state.loading.verifyOtp = true;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading.verifyOtp = false;
      })
      .addCase(verifyOtp.rejected, state => {
        state.loading.verifyOtp = false;
      })


      // 🔐 LOGIN (🔥 FIXED)
      .addCase(loginUser.pending, state => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;

        const token = action.payload.access_token;
        const mappedUser = mapDriverToUser(action.payload.driver_info);

        state.token = token;
        state.user = mappedUser;

        const expiryTime = Date.now() + 1800 * 1000;

        AsyncStorage.setItem(
          'authData',
          JSON.stringify({
            token,
            user: mappedUser,
            expiry: expiryTime,
          }),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
