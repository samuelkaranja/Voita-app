import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProfile,
  updateProfile,
  updateVehicle,
} from '../../services/profileService';

type ProfileState = {
  loading: boolean;
  updating: boolean;

  user: any | null;
  vehicle: any | null;
  config: any | null;
  reminders: any[];

  error: string | null;
};

const initialState: ProfileState = {
  loading: false,
  updating: false,

  user: null,
  vehicle: null,
  config: null,
  reminders: [],

  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (token: string, thunkAPI) => {
    try {
      const res = await getProfile(token);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (
    {
      token,
      data,
    }: {
      token: string;
      data: any;
    },
    thunkAPI,
  ) => {
    try {
      const res = await updateProfile(token, data);
      return res.user;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const saveVehicle = createAsyncThunk(
  'profile/saveVehicle',
  async (
    {
      token,
      vehicleId,
      data,
    }: {
      token: string;
      vehicleId: string;
      data: any;
    },
    thunkAPI,
  ) => {
    try {
      const res = await updateVehicle(token, vehicleId, data);
      return res.vehicle;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLocalUser(state, action) {
      state.user = action.payload;
    },
    setLocalVehicle(state, action) {
      state.vehicle = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      // FETCH PROFILE
      .addCase(fetchProfile.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.vehicle = action.payload.vehicle;
        state.config = action.payload.config;
        state.reminders = action.payload.reminders;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SAVE PROFILE
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // SAVE VEHICLE
      .addCase(saveVehicle.fulfilled, (state, action) => {
        state.vehicle = action.payload;
      });
  },
});

export const { setLocalUser, setLocalVehicle } = profileSlice.actions;
export default profileSlice.reducer;
