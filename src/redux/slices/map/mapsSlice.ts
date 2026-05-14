import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1/maps';

/* =========================================================
   PETROL
========================================================= */
export const fetchPetrolStations = createAsyncThunk(
  'maps/fetchPetrol',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const res = await fetch(
      `${BASE_URL}/places/petrol?lat=${lat}&lng=${lng}&radius=5000`,
    );

    const data = await res.json();
    return data.places || [];
  },
);

/* =========================================================
   EMERGENCY
========================================================= */
export const fetchEmergency = createAsyncThunk(
  'maps/fetchEmergency',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const res = await fetch(
      `${BASE_URL}/places/emergency?lat=${lat}&lng=${lng}&radius=5000`,
    );

    const data = await res.json();
    return data.places || [];
  },
);

/* =========================================================
   SAFE ROUTE
========================================================= */
export const fetchSafeRoute = createAsyncThunk(
  'maps/fetchSafeRoute',
  async ({
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng,
  }: {
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
  }) => {
    const res = await fetch(
      `${BASE_URL}/routes/safe?origin_lat=${origin_lat}&origin_lng=${origin_lng}&destination_lat=${destination_lat}&destination_lng=${destination_lng}`,
    );

    const data = await res.json();

    if (!data?.route?.coordinates || !Array.isArray(data.route.coordinates)) {
      return [];
    }

    return data.route.coordinates.map((coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));
  },
);

/* =========================================================
   NORMAL ROUTE
========================================================= */
export const fetchNormalRoute = createAsyncThunk(
  'maps/fetchNormalRoute',
  async ({
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng,
  }: {
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
  }) => {
    const GOOGLE_KEY = 'AIzaSyDAaZnQ6p4Zase38K03Rk8LbCyGlfmaUCg';

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin_lat},${origin_lng}&destination=${destination_lat},${destination_lng}&key=${GOOGLE_KEY}`,
    );

    const data = await res.json();

    console.log('🌐 GOOGLE DIRECTIONS:', data);

    if (!data.routes?.length) {
  return {
    coords: [],
    distance: null,
    duration: null,
  };
}

const route = data.routes[0];
const leg = route.legs[0];

const encoded = route.overview_polyline.points;

// 🔥 Decode polyline (keep your existing function)
const decodePolyline = (t: string) => {
  let points = [];
  let index = 0,
    lat = 0,
    lng = 0;

  while (index < t.length) {
    let b,
      shift = 0,
      result = 0;

    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
};

return {
  coords: decodePolyline(encoded),
  distance: leg.distance?.text || null,
  duration: leg.duration?.text || null,
};
  },
);

/* =========================================================
   SLICE
========================================================= */
const mapsSlice = createSlice({
  name: 'maps',

  initialState: {
    places: [] as any[],

    // ROUTES
    safeRouteCoords: [] as any[],
    normalRouteCoords: [] as any[],

    // DESTINATION (🔥 NEW IMPORTANT ADDITION)
    destination: null as null | {
  text: string;
  latitude: number;
  longitude: number;
},

normalRouteInfo: {
  distance: null as string | null,
  duration: null as string | null,
},

    loading: false,
    error: null as string | null,
  },

  reducers: {
    clearMapData: state => {
      state.places = [];
      state.safeRouteCoords = [];
      state.normalRouteCoords = [];
      state.error = null;
    },

    // 🔥 NEW: destination setter
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
  },

  extraReducers: builder => {
    builder

      /* =========================
         PETROL
      ========================= */
      .addCase(fetchPetrolStations.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;

        state.safeRouteCoords = [];
        state.normalRouteCoords = [];
      })

      /* =========================
         EMERGENCY
      ========================= */
      .addCase(fetchEmergency.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;

        state.safeRouteCoords = [];
        state.normalRouteCoords = [];
      })

      /* =========================
         SAFE ROUTE
      ========================= */
      .addCase(fetchSafeRoute.fulfilled, (state, action) => {
        state.loading = false;

        state.safeRouteCoords = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.normalRouteCoords = [];
        state.places = [];
      })

      /* =========================
         NORMAL ROUTE
      ========================= */
      .addCase(fetchNormalRoute.fulfilled, (state, action) => {
  state.loading = false;

  state.normalRouteCoords = action.payload.coords || [];

  state.normalRouteInfo = {
    distance: action.payload.distance,
    duration: action.payload.duration,
  };

  state.safeRouteCoords = [];
  state.places = [];
})

      /* =========================
         ERROR HANDLING
      ========================= */
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error =
            action.error?.message || 'Something went wrong';
        },
      );
  },
});

export const { clearMapData, setDestination } = mapsSlice.actions;
export default mapsSlice.reducer;
