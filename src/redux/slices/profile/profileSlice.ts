import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../../api/config';

// ── Debug helpers ─────────────────────────────────────────────────────────────
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

// ── Safe error extractor ──────────────────────────────────────────────────────
const extractError = (err: any): string => {
  const detail = err.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((e: any) => e.msg).join(', ');
  return err.message || 'Request failed';
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface EmergencyContact {
  id: string;
  name: string;
  relationship_type: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  number_plate: string;
  vehicle_type: string;
  model_year: string;
  color: string;
  fuel_type: string;
  alloy_type?: string;
  pressure_front?: number;
  pressure_rear?: number;
  photo_url?: string;
  is_calibrated: boolean;
  insurance_expiry?: string;
  license_expiry?: string;
  last_service_date?: string;
  next_tire_rotation?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender?: string;
  profile_image_url?: string;
  membership_label: string;
  member_since: string;
}

interface ProfileState {
  profile: Profile | null;
  emergencyContacts: EmergencyContact[];
  vehicles: Vehicle[];
  primaryVehicleId: string | null;
  loading: {
    profile: boolean;
    updateProfile: boolean;
    avatar: boolean;
    contacts: boolean;
    vehicles: boolean;
  };
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  emergencyContacts: [],
  vehicles: [],
  primaryVehicleId: null,
  loading: {
    profile: false,
    updateProfile: false,
    avatar: false,
    contacts: false,
    vehicles: false,
  },
  error: null,
};

// ── Auth header helper ────────────────────────────────────────────────────────
const authHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ── PROFILE ───────────────────────────────────────────────────────────────────
export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/profile`,
        authHeader(token),
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: any, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v) form.append(k, v as string);
      });
      debugRequest('updateProfile', {
        url: `${BASE_URL}/api/v1/profile`,
        token: token ? `${token.substring(0, 20)}...` : 'NULL ⚠️',
        fields: data,
      });
      const res = await axios.put(`${BASE_URL}/api/v1/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      debugResponse('updateProfile', res.data);
      return res.data;
    } catch (err: any) {
      debugError('updateProfile', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (imageUri: string, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const form = new FormData();
      form.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any);
      debugRequest('uploadAvatar', {
        url: `${BASE_URL}/api/v1/profile/avatar`,
        token: token ? `${token.substring(0, 20)}...` : 'NULL ⚠️',
        imageUri,
      });
      const res = await axios.post(`${BASE_URL}/api/v1/profile/avatar`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      debugResponse('uploadAvatar', res.data);
      return res.data;
    } catch (err: any) {
      debugError('uploadAvatar', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteAvatar = createAsyncThunk(
  'profile/deleteAvatar',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/profile/avatar`,
        authHeader(token),
      );
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ── EMERGENCY CONTACTS ────────────────────────────────────────────────────────
export const fetchEmergencyContacts = createAsyncThunk(
  'profile/fetchContacts',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      debugRequest('fetchEmergencyContacts', {
        url: `${BASE_URL}/api/v1/profile/emergency-contacts`,
        token: token ? `${token.substring(0, 20)}...` : 'NULL ⚠️',
      });
      const res = await axios.get(
        `${BASE_URL}/api/v1/profile/emergency-contacts`,
        authHeader(token),
      );
      debugResponse('fetchEmergencyContacts', res.data);
      return res.data.contacts as EmergencyContact[];
    } catch (err: any) {
      debugError('fetchEmergencyContacts', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const addEmergencyContact = createAsyncThunk(
  'profile/addContact',
  async (
    data: { name: string; relationship_type: string; phone: string },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      // Serialize manually to guarantee exact JSON string
      const body = JSON.stringify(data);
      if (__DEV__) {
        console.log('Raw body being sent:', body);
        console.log('Token present:', !!token);
      }

      const res = await axios.post(
        `${BASE_URL}/api/v1/profile/emergency-contacts`,
        body, // ← send pre-serialized string
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (__DEV__) {
        console.log('Contact response:', JSON.stringify(res.data));
      }
      return res.data.contacts as EmergencyContact[];
    } catch (err: any) {
      if (__DEV__) {
        console.log(
          'Contact error full response:',
          JSON.stringify(err.response?.data),
        );
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateEmergencyContact = createAsyncThunk(
  'profile/updateContact',
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: { name: string; relationship_type: string; phone: string };
    },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/profile/emergency-contacts/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // ← explicit JSON
          },
        },
      );
      return res.data.contacts as EmergencyContact[];
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteEmergencyContact = createAsyncThunk(
  'profile/deleteContact',
  async (id: string, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/profile/emergency-contacts/${id}`,
        authHeader(token),
      );
      return id;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ── VEHICLES ──────────────────────────────────────────────────────────────────
export const fetchVehicles = createAsyncThunk(
  'profile/fetchVehicles',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/vehicles/`,
        authHeader(token),
      );
      return res.data; // { vehicles: [...], total: n, primary_vehicle: "uuid" }
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const addVehicle = createAsyncThunk(
  'profile/addVehicle',
  async (
    vehicleData: {
      registration_number: string;
      make: string;
      model: string;
      year: number;
      color: string;
      fuel_type: string;
      alloy_type?: string;
      pressure_front?: number;
      pressure_rear?: number;
      image_url?: string;
      is_calibrated?: boolean;
      insurance_expiry?: string;
      license_expiry?: string;
      last_service_date?: string;
      next_tire_rotation?: string;
    },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      debugRequest('addVehicle', {
        url: `${BASE_URL}/api/v1/vehicles/`,
        vehicleData,
      });
      const res = await axios.post(
        `${BASE_URL}/api/v1/vehicles/`,
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      debugResponse('addVehicle', res.data);
      return res.data; // single Vehicle object
    } catch (err: any) {
      debugError('addVehicle', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateVehicle = createAsyncThunk(
  'profile/updateVehicle',
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        registration_number?: string;
        make?: string;
        model?: string;
        year?: number;
        color?: string;
        fuel_type?: string;
        alloy_type?: string;
        pressure_front?: number;
        pressure_rear?: number;
        image_url?: string;
        is_calibrated?: boolean;
        insurance_expiry?: string;
        license_expiry?: string;
        last_service_date?: string;
        next_tire_rotation?: string;
      };
    },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      debugRequest('updateVehicle', {
        url: `${BASE_URL}/api/v1/vehicles/${id}`,
        data,
      });
      const res = await axios.put(`${BASE_URL}/api/v1/vehicles/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      debugResponse('updateVehicle', res.data);
      return res.data; // single Vehicle object
    } catch (err: any) {
      debugError('updateVehicle', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteVehicle = createAsyncThunk(
  'profile/deleteVehicle',
  async (id: string, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/vehicles/${id}`,
        authHeader(token),
      );
      return id;
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const setPrimaryVehicle = createAsyncThunk(
  'profile/setPrimaryVehicle',
  async (id: string, { getState, rejectWithValue }) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/vehicles/${id}/set-primary`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return { vehicle: res.data, primaryId: id };
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const uploadVehiclePhoto = createAsyncThunk(
  'profile/uploadVehiclePhoto',
  async (
    { id, imageUri }: { id: string; imageUri: string },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      const form = new FormData();
      form.append('photo', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'vehicle.jpg',
      } as any);
      debugRequest('uploadVehiclePhoto', {
        url: `${BASE_URL}/api/v1/vehicles/${id}/photo`,
        imageUri,
      });
      const res = await axios.post(
        `${BASE_URL}/api/v1/vehicles/${id}/photo`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      debugResponse('uploadVehiclePhoto', res.data);
      return res.data; // single Vehicle object with updated photo_url
    } catch (err: any) {
      debugError('uploadVehiclePhoto', err);
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateMaintenanceDates = createAsyncThunk(
  'profile/updateMaintenanceDates',
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        insurance_expiry?: string;
        last_service_date?: string;
        next_tire_rotation?: string;
        license_expiry?: string;
      };
    },
    { getState, rejectWithValue },
  ) => {
    const token = (getState() as any).auth.token;
    if (!token) return rejectWithValue('Not authenticated');
    try {
      debugRequest('updateMaintenanceDates', {
        url: `${BASE_URL}/api/v1/vehicles/${id}/maintenance`,
        data,
      });
      const res = await axios.put(
        `${BASE_URL}/api/v1/vehicles/${id}/maintenance`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      debugResponse('updateMaintenanceDates', res.data);
      return res.data; // { id, insurance_expiry, last_service_date, next_tire_rotation, license_expiry }
    } catch (err: any) {
      debugError('updateMaintenanceDates', err);
      return rejectWithValue(extractError(err));
    }
  },
);

// ── SLICE ─────────────────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: state => {
      state.error = null;
    },
    resetProfile: state => {
      state.profile = null;
      state.emergencyContacts = [];
      state.vehicles = [];
      state.primaryVehicleId = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      // Fetch profile
      .addCase(fetchProfile.pending, state => {
        state.loading.profile = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload as string;
      })

      // Update profile
      .addCase(updateProfile.pending, state => {
        state.loading.updateProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error = action.payload as string;
      })

      // Avatar
      .addCase(uploadAvatar.pending, state => {
        state.loading.avatar = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading.avatar = false;
        state.profile = action.payload;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading.avatar = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAvatar.fulfilled, state => {
        if (state.profile) state.profile.profile_image_url = undefined;
      })

      // Emergency contacts
      .addCase(fetchEmergencyContacts.pending, state => {
        state.loading.contacts = true;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.loading.contacts = false;
        state.emergencyContacts = action.payload;
      })
      .addCase(fetchEmergencyContacts.rejected, (state, action) => {
        state.loading.contacts = false;
        if (action.payload !== 'Not authenticated') {
          state.error = action.payload as string;
        }
      })
      .addCase(addEmergencyContact.fulfilled, (state, action) => {
        state.emergencyContacts = action.payload;
      })
      .addCase(updateEmergencyContact.fulfilled, (state, action) => {
        state.emergencyContacts = action.payload;
      })
      .addCase(deleteEmergencyContact.fulfilled, (state, action) => {
        state.emergencyContacts = state.emergencyContacts.filter(
          c => c.id !== action.payload,
        );
      })

      // Vehicles
      .addCase(fetchVehicles.pending, state => {
        state.loading.vehicles = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading.vehicles = false;
        state.vehicles = action.payload.vehicles;
        state.primaryVehicleId = action.payload.primary_vehicle;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading.vehicles = false;
        if (action.payload !== 'Not authenticated') {
          state.error = action.payload as string;
        }
      })

      .addCase(addVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
        if (state.vehicles.length === 1) {
          state.primaryVehicleId = action.payload.id;
        }
      })

      .addCase(updateVehicle.fulfilled, (state, action) => {
        const idx = state.vehicles.findIndex(v => v.id === action.payload.id);
        if (idx !== -1) state.vehicles[idx] = action.payload;
      })

      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(v => v.id !== action.payload);
      })
      .addCase(setPrimaryVehicle.fulfilled, (state, action) => {
        state.primaryVehicleId = action.payload.primaryId;
      })
      .addCase(uploadVehiclePhoto.fulfilled, (state, action) => {
        const idx = state.vehicles.findIndex(v => v.id === action.payload.id);
        if (idx !== -1) state.vehicles[idx] = action.payload;
      })
      .addCase(updateMaintenanceDates.fulfilled, (state, action) => {
        const idx = state.vehicles.findIndex(v => v.id === action.payload.id);
        if (idx !== -1)
          state.vehicles[idx] = { ...state.vehicles[idx], ...action.payload };
      });
  },
});

export const { clearProfileError, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
