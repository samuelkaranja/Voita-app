import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1/maps';

/* ........... Petrol Stations ............ */

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

/* ............ Emergency ............ */

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

/* ........... SAFE ROUTE ............ */

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
    const GOOGLE_KEY = 'AIzaSyDAaZnQ6p4Zase38K03Rk8LbCyGlfmaUCg';

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin_lat},${origin_lng}&destination=${destination_lat},${destination_lng}&alternatives=true&avoid=highways&key=${GOOGLE_KEY}`,
    );

    const data = await res.json();

    console.log('🛡 SAFE ROUTES:', data);

    if (!data.routes || data.routes.length === 0) {
      return [];
    }

    /* ............. HELPER: Decode polyline ........... */

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

    /* .......... HELPER: Base scoring ......... */

    const scoreRoute = (route: any) => {
      const leg = route.legs[0];

      const duration = leg.duration.value; // seconds
      const steps = leg.steps.length;

      let score = 100;

      // Penalize complexity
      score -= steps * 2;

      // Penalize long routes
      score -= duration / 60;

      return score;
    };

    /* ........ HELPER: Midpoint ........ */

    const getMidPoint = (route: any) => {
      const steps = route.legs[0].steps;
      if (!steps || steps.length === 0) return null;

      return steps[Math.floor(steps.length / 2)].start_location;
    };

    /* ........ HELPER: Nearby places ........ */

    const fetchNearbyScore = async (lat: number, lng: number) => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=restaurant&key=${GOOGLE_KEY}`,
        );

        const data = await res.json();

        return data.results?.length || 0;
      } catch (err) {
        console.log('Places API error:', err);
        return 0;
      }
    };

    /* ........ SELECT BEST ROUTE ........ */

    let bestRoute = data.routes[0];
    let bestScore = -Infinity;

    for (const route of data.routes) {
      let score = scoreRoute(route);

      const midpoint = getMidPoint(route);

      if (midpoint) {
        const nearbyCount = await fetchNearbyScore(midpoint.lat, midpoint.lng);

        console.log('📍 Nearby places:', nearbyCount);

        // Boost score with human activity
        score += nearbyCount * 5;
      }

      console.log('🛣 Route score:', score);

      if (score > bestScore) {
        bestScore = score;
        bestRoute = route;
      }
    }

    console.log('🏆 BEST SAFE ROUTE SCORE:', bestScore);

    const encoded = bestRoute.overview_polyline.points;

    const leg = bestRoute.legs[0];

    const safetyInsights = {
      fewerIntersections: true,
      highActivityAreas: true,
      avoidsHighRiskZones: true,
      congestionAvoided: true,
    };

    return {
      coords: decodePolyline(encoded),
      distance: leg.distance?.text || null,
      duration: leg.duration?.text || null,
      safetyInsights,
    };
  },
);

/* ........ NORMAL ROUTE ........ */

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
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin_lat},${origin_lng}&destination=${destination_lat},${destination_lng}&alternatives=true&key=${GOOGLE_KEY}`,
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

    console.log('ROUTES COUNT:', data.routes.length);

    const encoded = route.overview_polyline.points;

    // Decode polyline (keep your existing function)
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

/* ........ SLICE ........ */

const mapsSlice = createSlice({
  name: 'maps',

  initialState: {
    places: [] as any[],

    // ROUTES
    safeRouteCoords: [] as any[],
    normalRouteCoords: [] as any[],

    // DESTINATION
    destination: null as null | {
      text: string;
      latitude: number;
      longitude: number;
    },

    normalRouteInfo: {
      distance: null as string | null,
      duration: null as string | null,
    },

    safeRouteInfo: {
      distance: null as string | null,
      duration: null as string | null,
      safetyInsights: null as null | {
        fewerIntersections: boolean;
        highActivityAreas: boolean;
        avoidsHighRiskZones: boolean;
        congestionAvoided: boolean;
      },
    },

    loading: false,
    error: null as string | null,
  },

  reducers: {
    clearMapData: state => {
      state.places = [];
      state.safeRouteCoords = [];
      state.normalRouteCoords = [];
      state.safeRouteInfo = { distance: null, duration: null };
      state.normalRouteInfo = { distance: null, duration: null };
      state.error = null;
    },

    // NEW: destination setter
    setDestination: (state, action) => {
      state.destination = action.payload;
      state.safeRouteCoords = [];
      state.normalRouteCoords = [];
      state.safeRouteInfo = { distance: null, duration: null };
      state.normalRouteInfo = { distance: null, duration: null };
      state.places = [];
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

      /* ........ PETROL ........ */

      .addCase(fetchPetrolStations.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;

        state.safeRouteCoords = [];
        state.normalRouteCoords = [];
      })

      /* ........ EMERGENCY ........ */

      .addCase(fetchEmergency.fulfilled, (state, action) => {
        state.loading = false;
        state.places = action.payload;

        state.safeRouteCoords = [];
        state.normalRouteCoords = [];
      })

      /* ........ SAFE ROUTE ........ */

      .addCase(fetchSafeRoute.fulfilled, (state, action) => {
        state.loading = false;

        state.safeRouteCoords = action.payload.coords || [];

        state.safeRouteInfo = {
          distance: action.payload.distance,
          duration: action.payload.duration,
          safetyInsights: action.payload.safetyInsights || null,
        };

        state.places = [];
      })

      /* ........ NORMAL ROUTE ........ */

      .addCase(fetchNormalRoute.fulfilled, (state, action) => {
        state.loading = false;

        state.normalRouteCoords = action.payload.coords || [];

        state.normalRouteInfo = {
          distance: action.payload.distance,
          duration: action.payload.duration,
        };
        state.places = [];
      })

      /* ........ ERROR HANDLING ........*/

      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action: any) => {
          state.loading = false;
          state.error = action.error?.message || 'Something went wrong';
        },
      );
  },
});

export const { clearMapData, setDestination } = mapsSlice.actions;
export default mapsSlice.reducer;
