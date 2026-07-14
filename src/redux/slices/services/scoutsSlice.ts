import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  apiFetch,
  apiFetchAuth,
  buildUrl,
  extractError,
} from '../../../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScoutSkill {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
}

export interface ScoutReview {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  comment: string;
}

export type ScoutCTAType = 'book' | 'request' | 'schedule';

// Shape returned by GET /scouts/ (list)
export interface ScoutListItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  missions_completed: number;
  avatar_url: string | null;
  bio: string;
  cta_type: ScoutCTAType;
  accent_color: string | null;
  tags: string[];
}

// Shape returned by GET /scouts/{id} (detail)
export interface ScoutDetail {
  id: string;
  name: string;
  role: string;
  rating: number;
  missions_completed: number;
  avatar_url: string | null;
  bio: string;
  cta_type: ScoutCTAType;
  accent_color: string | null;
  location: string;
  is_verified: boolean;
  tags: string[];
  skills: ScoutSkill[];
  reviews: ScoutReview[];
}

export interface Mission {
  id: string;
  user_id: string;
  scout_id: string | null;
  title: string;
  subtitle: string;
  detail: string;
  status: 'active' | 'completed';
  cost_or_status: string;
  icon: string;
  icon_bg_color: string;
  icon_color: string;
}

export interface CreateMissionPayload {
  scout_id?: string;
  title: string;
  subtitle?: string;
  detail?: string;
  status?: 'active' | 'completed';
  cost_or_status?: string;
  icon?: string;
  icon_bg_color?: string;
  icon_color?: string;
}

export interface ScoutFilters {
  search?: string;
  category?: string;
  limit?: number;
}

interface ScoutsState {
  list: ScoutListItem[];
  detail: ScoutDetail | null;
  missions: Mission[];
  filters: ScoutFilters;
  listLoading: boolean;
  detailLoading: boolean;
  missionsLoading: boolean;
  listError: string | null;
  detailError: string | null;
  missionsError: string | null;
}

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchScouts = createAsyncThunk<
  ScoutListItem[],
  ScoutFilters | undefined
>('scouts/fetchList', async (filters = {}, { rejectWithValue }) => {
  try {
    const url = buildUrl('/scouts/', {
      search: filters.search,
      category:
        filters.category && filters.category !== 'all'
          ? filters.category
          : undefined,
      limit: filters.limit,
    });
    return await apiFetch<ScoutListItem[]>(url);
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

export const fetchScoutDetail = createAsyncThunk<ScoutDetail, string>(
  'scouts/fetchDetail',
  async (scoutId, { rejectWithValue }) => {
    try {
      const url = buildUrl(`/scouts/${scoutId}/`);
      return await apiFetch<ScoutDetail>(url);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchUserMissions = createAsyncThunk<Mission[], string>(
  'scouts/fetchMissions',
  async (token, { rejectWithValue }) => {
    try {
      const url = buildUrl('/scouts/missions/user/');
      return await apiFetchAuth<Mission[]>(url, token);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createMission = createAsyncThunk<
  Mission,
  { token: string; payload: CreateMissionPayload }
>('scouts/createMission', async ({ token, payload }, { rejectWithValue }) => {
  try {
    const url = buildUrl('/scouts/missions/');
    return await apiFetchAuth<Mission>(url, token, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState: ScoutsState = {
  list: [],
  detail: null,
  missions: [],
  filters: {},
  listLoading: false,
  detailLoading: false,
  missionsLoading: false,
  listError: null,
  detailError: null,
  missionsError: null,
};

const scoutsSlice = createSlice({
  name: 'scouts',
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
      state.missionsError = null;
    },
  },
  extraReducers: builder => {
    // List
    builder
      .addCase(fetchScouts.pending, state => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchScouts.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchScouts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      });

    // Detail
    builder
      .addCase(fetchScoutDetail.pending, state => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchScoutDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detail = action.payload;
      })
      .addCase(fetchScoutDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      });

    // Missions
    builder
      .addCase(fetchUserMissions.pending, state => {
        state.missionsLoading = true;
        state.missionsError = null;
      })
      .addCase(fetchUserMissions.fulfilled, (state, action) => {
        state.missionsLoading = false;
        state.missions = action.payload;
      })
      .addCase(fetchUserMissions.rejected, (state, action) => {
        state.missionsLoading = false;
        state.missionsError = action.payload as string;
      });

    // Create mission — prepend to list optimistically
    builder.addCase(createMission.fulfilled, (state, action) => {
      state.missions.unshift(action.payload);
    });
  },
});

export const { setFilters, clearFilters, clearDetail, clearErrors } =
  scoutsSlice.actions;
export default scoutsSlice.reducer;
