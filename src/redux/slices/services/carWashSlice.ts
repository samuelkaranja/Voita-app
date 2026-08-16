import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiFetch,
  authorizedFetch,
  buildUrl,
  extractError,
} from '../../../services/api';

// Types

export interface CarWashService {
  id: string;
  label: string;
  description: string;
  price: string;
  icon: string;
  is_premium: boolean;
}

export interface CarWashReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

// Shape returned by GET /api/v1/car-washes/ (list)
export interface CarWashListItem {
  id: string;
  name: string;
  rating: number;
  distance_km: number | null;
  area: string;
  image_url: string;
  wait_time_mins: number;
  verified: boolean;
  tags: string[];
}

// Shape returned by GET /api/v1/car-washes/{id} (detail)
export interface CarWashDetail {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  address: string;
  area: string;
  description: string;
  image_url: string;
  verified: boolean;
  services: CarWashService[];
  reviews: CarWashReview[];
}

export interface CarWashFilters {
  search?: string;
  type?: string;
  lat?: number;
  lng?: number;
}

export interface CarWashSuggestionPayload {
  name: string;
  phone: string;
  location: string;
  serviceType: string; // Interior | Exterior | Full Detail
  reason: string;
}

interface CarWashState {
  list: CarWashListItem[];
  detail: CarWashDetail | null;
  filters: CarWashFilters;
  listLoading: boolean;
  detailLoading: boolean;
  listError: string | null;
  detailError: string | null;
  suggestLoading: boolean;
  suggestError: string | null;
}

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchCarWashes = createAsyncThunk<
  CarWashListItem[],
  CarWashFilters | undefined
>('carwash/fetchList', async (filters = {}, { rejectWithValue }) => {
  try {
    const url = buildUrl('/api/v1/car-washes/', {
      search: filters.search,
      type: filters.type && filters.type !== 'all' ? filters.type : undefined,
      lat: filters.lat,
      lng: filters.lng,
    });
    return await apiFetch<CarWashListItem[]>(url);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchCarWashDetail = createAsyncThunk<CarWashDetail, string>(
  'carwash/fetchDetail',
  async (carWashId, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/api/v1/car-washes/${carWashId}`);
      return await apiFetch<CarWashDetail>(url);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const suggestCarWash = createAsyncThunk<void, CarWashSuggestionPayload>(
  'carwash/suggest',
  async (payload, { rejectWithValue }) => {
    try {
      const url = buildUrl('/api/v1/car-washes/suggestions/');
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

const initialState: CarWashState = {
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

const carWashSlice = createSlice({
  name: 'carwash',
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
      .addCase(fetchCarWashes.pending, state => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchCarWashes.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchCarWashes.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    builder
      .addCase(fetchCarWashDetail.pending, state => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchCarWashDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchCarWashDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      });

    builder
      .addCase(suggestCarWash.pending, state => {
        state.suggestLoading = true;
        state.suggestError = null;
      })
      .addCase(suggestCarWash.fulfilled, state => {
        state.suggestLoading = false;
      })
      .addCase(suggestCarWash.rejected, (state, action) => {
        state.suggestLoading = false;
        state.suggestError = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearDetail, clearErrors } =
  carWashSlice.actions;
export default carWashSlice.reducer;
