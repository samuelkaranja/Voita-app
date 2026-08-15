import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from '../../../utils/tokenStorage';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  error: string | null;
  phone: string | null;
  verificationError: string | null;
  loading: {
    login: boolean;
    register: boolean;
    verifyOtp: boolean;
    sendOtp: boolean;
    init: boolean;
    refresh: boolean;
    sendVerificationEmail: boolean; // NEW
    //verifyEmail: boolean; // NEW
    requestPasswordReset: boolean; // NEW — POST /auth/forgot-password
    verifyResetOtp: boolean; // NEW — POST /auth/verify-reset-otp
    resetPassword: boolean; // NEW — POST /auth/reset-password (3-step flow)
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  tokenExpiresAt: null,
  error: null,
  phone: null,
  verificationError: null,
  loading: {
    login: false,
    register: false,
    verifyOtp: false,
    sendOtp: false,
    init: true,
    refresh: false,
    sendVerificationEmail: false,
    //verifyEmail: false,
    requestPasswordReset: false,
    verifyResetOtp: false,
    resetPassword: false,
  },
};

// MAPPER FUNCTION
const mapDriverToUser = (driver: any): User => ({
  firstName: driver?.first_name ?? '',
  lastName: driver?.last_name ?? '',
  email: driver?.email ?? '',
  phone: driver?.phone ?? '',
  profileImageUrl: driver?.profile_image_url ?? null,
  emailVerified: driver?.email_verified ?? false, // NEW
  phoneVerified: driver?.phone_verified ?? false,
});

// LOAD STORED AUTH
export const loadStoredAuth = createAsyncThunk(
  'auth/loadStoredAuth',
  async (_, { rejectWithValue }) => {
    try {
      const stored = await AsyncStorage.getItem('authData');
      if (!stored) return null;

      const { token, user, tokenExpiresAt } = JSON.parse(stored);
      const refreshToken = await getRefreshToken();

      // No refresh token at all — can't recover, force re-login
      if (!refreshToken) {
        await AsyncStorage.removeItem('authData');
        return null;
      }

      return { token, user, tokenExpiresAt };
    } catch (err) {
      return rejectWithValue('Failed to load auth');
    }
  },
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });

      await storeRefreshToken(res.data.refresh_token); // rotation

      return res.data;
    } catch (err: any) {
      await clearRefreshToken();
      return rejectWithValue(err.response?.data?.detail || 'Refresh failed');
    }
  },
);

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/register`, {
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

// SEND OTP
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/send-otp`, {
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

// VERIFY OTP — fixed to read `detail`, matching confirmed 400 body shape
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { phone, otp }: { phone: string; otp: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, {
        phone,
        otp_code: otp,
        purpose: 'phone_verification',
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'OTP failed', // was: .message — confirmed wrong via curl
      );
    }
  },
);

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ phone, password }: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
        phone,
        password,
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login failed');
    }
  },
);

// SEND VERIFICATION EMAIL — now returns HTTP 500 + {detail} on failure
export const sendVerificationEmail = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/send-verification-email`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to send verification email',
      );
    }
  },
);

// VERIFY EMAIL — still returns HTTP 200 even on failure, so check success manually
// export const verifyEmail = createAsyncThunk(
//   'auth/verifyEmail',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/v1/auth/verify-email`, {
//         params: { token },
//       });
//       if (!res.data.success) {
//         return rejectWithValue(res.data.message || 'Verification failed');
//       }
//       return res.data; // { success: true, message, email_verified: true }
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.detail || 'Verification failed',
//       );
//     }
//   },
// );

// ─────────────────────────────────────────────────────────────
// PASSWORD RESET (3-step flow) — unauthenticated, no token header.
// reset_token is intentionally NOT persisted in Redux state or
// AsyncStorage per backend security notes; each thunk's resolved
// value is read via `.unwrap()` in the calling screen and passed
// forward through navigation params only.
//
// NOTE: `detail` field assumption below is from the backend spec
// doc, not yet curl-confirmed for these 3 endpoints specifically —
// verify actual 400/404 error body shape before relying on it,
// same way `verifyOtp` above was corrected after curl testing.
// ─────────────────────────────────────────────────────────────

// STEP 1: REQUEST PASSWORD RESET OTP
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/forgot-password`, {
        phone,
      });

      return res.data; // { success, message, phone, otp_id, expires_in_minutes }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to send OTP',
      );
    }
  },
);

// STEP 2: VERIFY RESET OTP — returns reset_token, consumes the OTP server-side
export const verifyResetOtp = createAsyncThunk(
  'auth/verifyResetOtp',
  async (
    { phone, otpCode }: { phone: string; otpCode: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify-reset-otp`, {
        phone,
        otp_code: otpCode,
      });

      return res.data; // { success, message, reset_token, expires_in_minutes }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Invalid or expired OTP',
      );
    }
  },
);

// STEP 3: RESET PASSWORD USING reset_token
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    {
      phone,
      resetToken,
      newPassword,
    }: { phone: string; resetToken: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/auth/reset-password`, {
        phone,
        reset_token: resetToken,
        new_password: newPassword,
      });

      return res.data; // { success, message, phone }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to reset password',
      );
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
      state.tokenExpiresAt = null;
      AsyncStorage.removeItem('authData');
      clearRefreshToken();
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
          state.user = action.payload.user; // restore user
          state.tokenExpiresAt = action.payload.tokenExpiresAt;
        }
      })
      .addCase(loadStoredAuth.rejected, state => {
        state.loading.init = false;
      })

      // REFRESH TOKEN
      .addCase(refreshAccessToken.pending, state => {
        state.loading.refresh = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading.refresh = false;
        const expiresAt = Date.now() + action.payload.expires_in * 1000;

        state.token = action.payload.access_token;
        state.tokenExpiresAt = expiresAt;

        AsyncStorage.setItem(
          'authData',
          JSON.stringify({
            token: action.payload.access_token,
            user: state.user,
            tokenExpiresAt: expiresAt,
          }),
        );
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.loading.refresh = false;
        state.token = null;
        state.user = null;
        state.tokenExpiresAt = null;
        AsyncStorage.removeItem('authData');
      })

      // REGISTER
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

      // SEND OTP
      .addCase(sendOtp.pending, state => {
        state.loading.sendOtp = true;
      })
      .addCase(sendOtp.fulfilled, state => {
        state.loading.sendOtp = false;
      })
      .addCase(sendOtp.rejected, state => {
        state.loading.sendOtp = false;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, state => {
        state.loading.verifyOtp = true;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading.verifyOtp = false;
        if (state.user) {
          state.user.phoneVerified = true;
        }
      })
      .addCase(verifyOtp.rejected, state => {
        state.loading.verifyOtp = false;
      })

      .addCase(loginUser.pending, state => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading.login = false;

        const token = action.payload.access_token;
        const mappedUser = mapDriverToUser(action.payload.driver_info);
        const expiresAt = Date.now() + action.payload.expires_in * 1000; // use actual value, not hardcoded 1800

        state.token = token;
        state.user = mappedUser;
        state.tokenExpiresAt = expiresAt;

        storeRefreshToken(action.payload.refresh_token); // fire-and-forget is fine here, Keychain write

        AsyncStorage.setItem(
          'authData',
          JSON.stringify({
            token,
            user: mappedUser,
            tokenExpiresAt: expiresAt,
          }),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload as string;
      })

      // SEND VERIFICATION EMAIL
      .addCase(sendVerificationEmail.pending, state => {
        state.loading.sendVerificationEmail = true;
      })
      .addCase(sendVerificationEmail.fulfilled, state => {
        state.loading.sendVerificationEmail = false;
      })
      .addCase(sendVerificationEmail.rejected, state => {
        state.loading.sendVerificationEmail = false;
      })

      // PASSWORD RESET — STEP 1: REQUEST OTP
      .addCase(requestPasswordReset.pending, state => {
        state.loading.requestPasswordReset = true;
      })
      .addCase(requestPasswordReset.fulfilled, state => {
        state.loading.requestPasswordReset = false;
      })
      .addCase(requestPasswordReset.rejected, state => {
        state.loading.requestPasswordReset = false;
      })

      // PASSWORD RESET — STEP 2: VERIFY OTP
      .addCase(verifyResetOtp.pending, state => {
        state.loading.verifyResetOtp = true;
      })
      .addCase(verifyResetOtp.fulfilled, state => {
        state.loading.verifyResetOtp = false;
        // reset_token intentionally not stored here — read via .unwrap()
        // in the screen and pass forward through navigation params.
      })
      .addCase(verifyResetOtp.rejected, state => {
        state.loading.verifyResetOtp = false;
      })

      // PASSWORD RESET — STEP 3: SET NEW PASSWORD
      .addCase(resetPassword.pending, state => {
        state.loading.resetPassword = true;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading.resetPassword = false;
      })
      .addCase(resetPassword.rejected, state => {
        state.loading.resetPassword = false;
      });

    // VERIFY EMAIL
    // .addCase(verifyEmail.pending, state => {
    //   state.loading.verifyEmail = true;
    //   state.verificationError = null;
    // })
    // .addCase(verifyEmail.fulfilled, state => {
    //   state.loading.verifyEmail = false;
    //   if (state.user) {
    //     state.user.emailVerified = true;
    //     AsyncStorage.setItem(
    //       'authData',
    //       JSON.stringify({
    //         token: state.token,
    //         user: state.user,
    //         tokenExpiresAt: state.tokenExpiresAt,
    //       }),
    //     );
    //   }
    // })
    // .addCase(verifyEmail.rejected, (state, action) => {
    //   state.loading.verifyEmail = false;
    //   state.verificationError = action.payload as string;
    // });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
