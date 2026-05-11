import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1/maps';

// PETROL
export const fetchPetrolStations = createAsyncThunk(
  'maps/fetchPetrol',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const res = await fetch(
      `${BASE_URL}/places/petrol?lat=${lat}&lng=${lng}&radius=5000`,
    );
    const data = await res.json();
    return data.places;
  },
);

// EMERGENCY
export const fetchEmergency = createAsyncThunk(
  'maps/fetchEmergency',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const res = await fetch(
      `${BASE_URL}/places/emergency?lat=${lat}&lng=${lng}&radius=5000`,
    );
    const data = await res.json();
    return data.places;
  },
);

// SAFE ROUTE
export const fetchSafeRoute = createAsyncThunk(
  'maps/fetchSafeRoute',
  async ({
    origin_lat,
    origin_lng,
  }: {
    origin_lat: number;
    origin_lng: number;
  }) => {
    const destination_lat = -1.1033;
    const destination_lng = 37.0153;

    const res = await fetch(
      `${BASE_URL}/routes/safe?origin_lat=${origin_lat}&origin_lng=${origin_lng}&destination_lat=${destination_lat}&destination_lng=${destination_lng}`,
    );

    const data = await res.json();
    return data.route.coordinates;
  },
);

const mapsSlice = createSlice({
  name: 'maps',
  initialState: {
    places: [] as any[],
    routeCoords: [] as any[],
    loading: false,
  },
  reducers: {
    clearMapData: state => {
      state.places = [];
      state.routeCoords = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPetrolStations.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPetrolStations.fulfilled, (state, action) => {
        console.log('PETROL DATA:', action.payload);
        state.loading = false;
        state.places = action.payload;
        state.routeCoords = [];
      })

      .addCase(fetchEmergency.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;
        state.routeCoords = [];
      })

      .addCase(fetchSafeRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.routeCoords = action.payload;
        state.places = [];
      });
  },
});

export const { clearMapData } = mapsSlice.actions;
export default mapsSlice.reducer;
