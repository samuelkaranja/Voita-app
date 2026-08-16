import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiFetch,
  authorizedFetch,
  buildUrl,
  extractError,
} from '../../../services/api';

// Types

export interface MechanicService {
  id: string;
  mechanic_id: string;
  label: string;
  description: string;
  icon: string;
  highlighted: boolean;
  created_at: string;
  updated_at: string;
}

export interface MechanicReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

export interface InsurancePartner {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Shape returned by GET /api/v1/mechanics/ (list)
export interface MechanicListItem {
  id: string;
  name: string;
  rating: number;
  distance_km: number | null;
  image_url: string;
  verified: boolean;
  available_today: boolean;
  specialties: string[];
}

// Shape returned by GET /api/v1/mechanics/{id} (detail)
export interface MechanicDetail {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  address: string;
  availability: boolean;
  specialties: string[];
  description: string;
  image_url: string;
  verified: boolean;
  services: MechanicService[];
  reviews: MechanicReview[];
  insurance_partners: InsurancePartner[];
}

export interface MechanicsFilters {
  search?: string;
  type?: string;
  lat?: number;
  lng?: number;
}

export interface MechanicSuggestionPayload {
  name: string;
  phone: string;
  location: string;
  specialty: string;
  reason: string;
}

interface MechanicsState {
  list: MechanicListItem[];
  detail: MechanicDetail | null;
  filters: MechanicsFilters;
  listLoading: boolean;
  detailLoading: boolean;
  listError: string | null;
  detailError: string | null;
  suggestLoading: boolean;
  suggestError: string | null;
}

// Thunks

export const fetchMechanics = createAsyncThunk<
  MechanicListItem[],
  MechanicsFilters | undefined
>('mechanics/fetchList', async (filters = {}, { rejectWithValue }) => {
  try {
    const url = buildUrl('/api/v1/mechanics/', {
      search: filters.search,
      type: filters.type && filters.type !== 'all' ? filters.type : undefined,
      lat: filters.lat,
      lng: filters.lng,
    });
    return await apiFetch<MechanicListItem[]>(url);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchMechanicDetail = createAsyncThunk<MechanicDetail, string>(
  'mechanics/fetchDetail',
  async (mechanicId, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/api/v1/mechanics/${mechanicId}`);
      return await apiFetch<MechanicDetail>(url);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const suggestMechanic = createAsyncThunk<
  void,
  MechanicSuggestionPayload
>('mechanics/suggest', async (payload, { rejectWithValue }) => {
  try {
    const url = buildUrl('/api/v1/mechanics/suggestions/');
    await authorizedFetch<void>(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    return rejectWithValue(extractError(err));
  }
});

// Slice

const initialState: MechanicsState = {
  list: [],
  detail: null,
  filters: {},
  listLoading: false,
  detailLoading: false,
  listError: null,
  detailError: null,
  suggestLoading: false,
  suggestError: null,
};

const mechanicsSlice = createSlice({
  name: 'mechanics',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {};
    },
    clearDetail(state) {
      state.detail = null;
      state.detailError = null;
    },
    clearErrors(state) {
      state.listError = null;
      state.detailError = null;
    },
  },
  extraReducers: builder => {
    // List
    builder
      .addCase(fetchMechanics.pending, state => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchMechanics.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchMechanics.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    // Detail
    builder
      .addCase(fetchMechanicDetail.pending, state => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchMechanicDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchMechanicDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      });

    // Suggest
    builder
      .addCase(suggestMechanic.pending, state => {
        state.suggestLoading = true;
        state.suggestError = null;
      })
      .addCase(suggestMechanic.fulfilled, state => {
        state.suggestLoading = false;
      })
      .addCase(suggestMechanic.rejected, (state, action) => {
        state.suggestLoading = false;
        state.suggestError = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearDetail, clearErrors } =
  mechanicsSlice.actions;
export default mechanicsSlice.reducer;
