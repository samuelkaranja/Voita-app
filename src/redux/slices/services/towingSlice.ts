import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiFetch,
  authorizedFetch,
  buildUrl,
  extractError,
} from '../../../services/api';

// Types

export interface TowingService {
  id: string;
  label: string;
  description: string;
  icon: string;
  is_highlighted: boolean;
}

export interface TowingQuickService {
  id: string;
  label: string;
  icon: string;
}

export interface TowingReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

export type TowingAvailability = 'available' | 'busy';
export type TowingVehicleType = 'flatbed' | 'heavy' | 'roadside';

// Shape returned by GET /api/v1/towing-providers/ (list)
export interface TowingListItem {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  distance_km: number | null;
  eta_min: number;
  eta_max: number;
  tags: string[];
  availability: TowingAvailability;
  vehicle_type: TowingVehicleType;
  is_partner: boolean;
}

// Shape returned by GET /api/v1/towing-providers/{id} (detail)
export interface TowingDetail {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  eta_min: number;
  eta_max: number;
  availability: TowingAvailability;
  is_partner: boolean;
  verified: boolean;
  phone_number: string;
  image_url: string;
  description: string;
  services: TowingService[];
  quick_services: TowingQuickService[];
  reviews: TowingReview[];
}

export interface TowingFilters {
  type?: string;
  search?: string;
  lat?: number;
  lng?: number;
}

export interface TowingSuggestionPayload {
  name: string;
  phone: string;
  location: string;
  vehicleType: string; // Flatbed | Roadside | Heavy Duty
  reason: string;
}

interface TowingState {
  list: TowingListItem[];
  detail: TowingDetail | null;
  filters: TowingFilters;
  listLoading: boolean;
  detailLoading: boolean;
  listError: string | null;
  detailError: string | null;
  suggestLoading: boolean;
  suggestError: string | null;
}

// Thunks

export const fetchTowingProviders = createAsyncThunk<
  TowingListItem[],
  TowingFilters | undefined
>('towing/fetchList', async (filters = {}, { rejectWithValue }) => {
  try {
    const url = buildUrl('/api/v1/towing-providers/', {
      type: filters.type && filters.type !== 'all' ? filters.type : undefined,
      search: filters.search,
      lat: filters.lat,
      lng: filters.lng,
    });
    return await apiFetch<TowingListItem[]>(url);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchTowingDetail = createAsyncThunk<TowingDetail, string>(
  'towing/fetchDetail',
  async (providerId, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/api/v1/towing-providers/${providerId}`);
      return await apiFetch<TowingDetail>(url);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const suggestTowing = createAsyncThunk<void, TowingSuggestionPayload>(
  'towing/suggest',
  async (payload, { rejectWithValue }) => {
    try {
      const url = buildUrl('/api/v1/towing-providers/suggestions/');
      await authorizedFetch<void>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      return rejectWithValue(extractError(err));
    }
  },
);

// Slice

const initialState: TowingState = {
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

const towingSlice = createSlice({
  name: 'towing',
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
    builder
      .addCase(fetchTowingProviders.pending, state => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchTowingProviders.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchTowingProviders.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    builder
      .addCase(fetchTowingDetail.pending, state => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchTowingDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchTowingDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      });

    builder
      .addCase(suggestTowing.pending, state => {
        state.suggestLoading = true;
        state.suggestError = null;
      })
      .addCase(suggestTowing.fulfilled, state => {
        state.suggestLoading = false;
      })
      .addCase(suggestTowing.rejected, (state, action) => {
        state.suggestLoading = false;
        state.suggestError = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearDetail, clearErrors } =
  towingSlice.actions;
export default towingSlice.reducer;
