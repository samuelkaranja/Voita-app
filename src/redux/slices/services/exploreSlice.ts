import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, buildUrl, extractError } from '../../../services/api';

// Types

export type ServiceCategory = 'mechanic' | 'carwash' | 'towing' | 'scout';

export interface ExploreProvider {
  id: string;
  name: string;
  rating: number;
  image_url: string;
  verified: boolean;
  category: ServiceCategory;
  created_at: string;
  distance_km: number | null;
}

interface ExploreState {
  topRated: ExploreProvider[];
  recentlyAdded: ExploreProvider[];
  loading: boolean;
  error: string | null;
}

// Helpers

function normalize(items: any[], category: ServiceCategory): ExploreProvider[] {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    rating: item.rating,
    image_url: item.image_url ?? item.avatar_url ?? '',
    verified: item.verified ?? item.is_verified ?? false,
    category,
    created_at: item.created_at,
    distance_km: item.distance_km ?? null,
  }));
}

// Thunk

export const fetchExploreData = createAsyncThunk<
  { topRated: ExploreProvider[]; recentlyAdded: ExploreProvider[] },
  { lat?: number; lng?: number } | void
>('explore/fetchAll', async (coords, { rejectWithValue }) => {
  try {
    const lat = coords?.lat;
    const lng = coords?.lng;

    const [mechanics, carWashes, towing, scouts] = await Promise.all([
      apiFetch<any[]>(buildUrl('/api/v1/mechanics/', { lat, lng })),
      apiFetch<any[]>(buildUrl('/api/v1/car-washes/', { lat, lng })),
      apiFetch<any[]>(buildUrl('/api/v1/towing-providers/', { lat, lng })),
      apiFetch<any[]>(buildUrl('/api/v1/scouts/', { lat, lng })),
    ]);

    const mechanicsNorm = normalize(mechanics, 'mechanic');
    const carWashesNorm = normalize(carWashes, 'carwash');
    const towingNorm = normalize(towing, 'towing');
    const scoutsNorm = normalize(scouts, 'scout');

    // Top rated — highest rated provider from each category
    const topRated: ExploreProvider[] = [
      mechanicsNorm.sort((a, b) => b.rating - a.rating)[0],
      carWashesNorm.sort((a, b) => b.rating - a.rating)[0],
      towingNorm.sort((a, b) => b.rating - a.rating)[0],
      scoutsNorm.sort((a, b) => b.rating - a.rating)[0],
    ].filter(Boolean); // removes undefined if a category has no providers yet

    // Recently added — most recently added provider from each category
    const recentlyAdded: ExploreProvider[] = [
      mechanicsNorm.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0],
      carWashesNorm.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0],
      towingNorm.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0],
      scoutsNorm.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0],
    ].filter(Boolean);

    return { topRated, recentlyAdded };
  } catch (err) {
    return rejectWithValue(extractError(err));
  }
});

// Slice

const initialState: ExploreState = {
  topRated: [],
  recentlyAdded: [],
  loading: false,
  error: null,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExploreData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExploreData.fulfilled, (state, action) => {
        state.loading = false;
        state.topRated = action.payload.topRated;
        state.recentlyAdded = action.payload.recentlyAdded;
      })
      .addCase(fetchExploreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exploreSlice.reducer;
