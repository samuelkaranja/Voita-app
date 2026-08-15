import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://voita-backend.fly.dev/api/v1/maps';

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  startLocation: { lat: number; lng: number };
  maneuver?: string;
}

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
    isNight = false,
  }: {
    origin_lat: number;
    origin_lng: number;
    destination_lat: number;
    destination_lng: number;
    isNight?: boolean;
  }) => {
    const GOOGLE_KEY = 'AIzaSyDAaZnQ6p4Zase38K03Rk8LbCyGlfmaUCg';

    /* ─── helpers ─── */

    const decodePolyline = (t: string) => {
      const points: { latitude: number; longitude: number }[] = [];
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
        lat += result & 1 ? ~(result >> 1) : result >> 1;
        shift = 0;
        result = 0;
        do {
          b = t.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        lng += result & 1 ? ~(result >> 1) : result >> 1;
        points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
      }
      return points;
    };

    // Midpoint of a route's steps — used to sample conditions along the route
    const getMidpoint = (route: any) => {
      const steps = route.legs[0].steps;
      if (!steps?.length) return null;
      return steps[Math.floor(steps.length / 2)].start_location as {
        lat: number;
        lng: number;
      };
    };

    /* ─── Step 1: Find a busy anchor waypoint near the route midpoint ─── */

    // We estimate the rough midpoint between origin and destination first
    const roughMidLat = (origin_lat + destination_lat) / 2;
    const roughMidLng = (origin_lng + destination_lng) / 2;

    // Place types that signal a busy, well-lit, public environment
    const SAFE_ANCHOR_TYPES =
      'shopping_mall|supermarket|hospital|train_station|bus_station';

    let waypointParam = '';
    let waypointName = '';

    try {
      const anchorRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
          `?location=${roughMidLat},${roughMidLng}` +
          `&radius=3000` +
          `&type=${SAFE_ANCHOR_TYPES}` +
          `&rankby=prominence` +
          `&key=${GOOGLE_KEY}`,
      );
      const anchorData = await anchorRes.json();
      const anchor = anchorData.results?.[0];

      if (anchor?.geometry?.location) {
        const { lat, lng } = anchor.geometry.location;
        waypointParam = `&waypoints=via:${lat},${lng}`;
        waypointName = anchor.name;
        console.log('🏢 Safe anchor waypoint:', waypointName, lat, lng);
      }
    } catch (err) {
      console.warn('Anchor waypoint fetch failed, proceeding without:', err);
    }

    /* ─── Step 2: Fetch route(s) via the anchor ─── */

    const directionsRes = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json` +
        `?origin=${origin_lat},${origin_lng}` +
        `&destination=${destination_lat},${destination_lng}` +
        `&alternatives=true` +
        `&avoid=highways|ferries` + // highways & ferries are isolated corridors
        `${waypointParam}` +
        `&key=${GOOGLE_KEY}`,
    );

    const directionsData = await directionsRes.json();
    console.log('🛡 SAFE ROUTE directions:', directionsData);

    if (!directionsData.routes?.length) {
      return {
        coords: [],
        distance: null,
        duration: null,
        safetyInsights: null,
        steps: [],
      };
    }

    /* ─── Step 3: Straight-line distance for detour tolerance ─── */

    const toRad = (d: number) => (d * Math.PI) / 180;
    const haversineKm = (
      a: { lat: number; lng: number },
      b: { lat: number; lng: number },
    ) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) *
          Math.cos(toRad(b.lat)) *
          Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.asin(Math.sqrt(h));
    };

    const straightLineKm = haversineKm(
      { lat: origin_lat, lng: origin_lng },
      { lat: destination_lat, lng: destination_lng },
    );

    /* ─── Step 4: Score each candidate ─── */

    // Lit establishment types — these are open after dark and indicate activity
    const LIT_TYPES = [
      'pharmacy',
      'bank',
      'atm',
      'convenience_store',
      'hospital',
      'police',
    ];

    const scoreRoute = async (
      route: any,
    ): Promise<{ score: number; insights: Record<string, any> }> => {
      const leg = route.legs[0];
      const routeDistanceKm = leg.distance.value / 1000;

      // ── Detour tolerance: reject routes >40% longer than straight-line ──
      const detourRatio = routeDistanceKm / Math.max(straightLineKm, 0.1);
      if (detourRatio > 1.4) {
        console.log(
          `⛔ Route rejected — detour ratio: ${detourRatio.toFixed(2)}`,
        );
        return { score: -Infinity, insights: {} };
      }

      let score = 100;
      const insights: Record<string, any> = {
        detourRatio: +detourRatio.toFixed(2),
        waypointName: waypointName || null,
      };

      // Sample 3 points along the route: quarter, mid, three-quarter
      const steps = leg.steps;
      const sampleIndices = [
        Math.floor(steps.length * 0.25),
        Math.floor(steps.length * 0.5),
        Math.floor(steps.length * 0.75),
      ];
      const samplePoints: { lat: number; lng: number }[] = sampleIndices
        .map(i => steps[i]?.start_location)
        .filter(Boolean);

      // ── Signal A: Lit establishments density ──
      // Boosts routes through always-lit areas (pharmacy, bank, police)
      let totalLitCount = 0;
      for (const point of samplePoints) {
        try {
          const litRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
              `?location=${point.lat},${point.lng}` +
              `&radius=300` +
              `&type=${LIT_TYPES.join('|')}` +
              `&key=${GOOGLE_KEY}`,
          );
          const litData = await litRes.json();
          totalLitCount += litData.results?.length ?? 0;
        } catch {
          /* non-critical */
        }
      }

      // Night mode doubles the value of lit establishments
      const litWeight = isNight ? 10 : 5;
      score += totalLitCount * litWeight;
      insights.litEstablishments = totalLitCount;
      console.log(
        `💡 Lit count: ${totalLitCount} (night=${isNight}, weight=${litWeight})`,
      );

      // ── Signal B: Open-now activity at travel time ──
      // Counts places currently open — active areas are safer
      let openNowCount = 0;
      const midpoint = getMidpoint(route);
      if (midpoint) {
        try {
          const openRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
              `?location=${midpoint.lat},${midpoint.lng}` +
              `&radius=500` +
              `&type=restaurant|cafe|bar|supermarket` +
              `&opennow=true` +
              `&key=${GOOGLE_KEY}`,
          );
          const openData = await openRes.json();
          openNowCount = openData.results?.length ?? 0;
        } catch {
          /* non-critical */
        }
      }
      score += openNowCount * 3;
      insights.openNowCount = openNowCount;
      console.log(`🕐 Open-now count: ${openNowCount}`);

      // ── Signal C: Waypoint proximity bonus ──
      // Reward routes that pass close to the anchor waypoint we injected
      if (waypointParam && midpoint) {
        // Already forced via waypoint — give a flat bonus to reward compliance
        score += 20;
        insights.waypointBonus = true;
      }

      // ── Signal D: Penalise routes with very few steps (likely isolated road) ──
      // Complex urban routes have many steps; isolated roads have few
      if (steps.length < 5) {
        score -= 30;
        insights.lowStepPenalty = true;
      }

      // ── Signal E: Washroom-friendly stops along route ──
      // Gas stations reliably have public washrooms in the Nairobi context
      const WASHROOM_TYPES = ['gas_station'];
      const washroomStops: string[] = [];

      for (const point of samplePoints) {
        try {
          const washroomRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
              `?location=${point.lat},${point.lng}` +
              `&radius=400` +
              `&type=${WASHROOM_TYPES.join('|')}` +
              `&key=${GOOGLE_KEY}`,
          );
          const washroomData = await washroomRes.json();
          for (const place of washroomData.results ?? []) {
            if (place?.name && !washroomStops.includes(place.name)) {
              washroomStops.push(place.name);
            }
          }
        } catch {
          /* non-critical */
        }
      }

      // Small bonus, capped so it doesn't dominate scoring
      score += Math.min(washroomStops.length, 3) * 2;
      insights.washroomStops = washroomStops.slice(0, 3);
      console.log(`🚻 Washroom stops found: ${washroomStops.length}`);

      insights.finalScore = Math.round(score);
      return { score, insights };
    };

    /* ─── Step 5: Pick the winner ─── */

    let bestRoute = directionsData.routes[0];
    let bestScore = -Infinity;
    let bestInsights: Record<string, any> = {};

    for (const route of directionsData.routes) {
      const { score, insights } = await scoreRoute(route);
      console.log('🛣 Candidate score:', score, insights);
      if (score > bestScore) {
        bestScore = score;
        bestRoute = route;
        bestInsights = insights;
      }
    }

    // If everything was rejected by detour filter, fall back to first route
    if (bestScore === -Infinity) {
      console.warn(
        'All routes rejected by detour filter, using first route as fallback',
      );
      bestRoute = directionsData.routes[0];
      bestInsights = { fallback: true };
    }

    console.log('🏆 Best safe route score:', bestScore, bestInsights);

    const leg = bestRoute.legs[0];
    const coords = decodePolyline(bestRoute.overview_polyline.points);

    const safetyInsights = {
      fewerIntersections: (bestRoute.legs[0].steps?.length ?? 0) >= 5,
      highActivityAreas: (bestInsights.openNowCount ?? 0) > 2,
      avoidsHighRiskZones: !bestInsights.lowStepPenalty,
      congestionAvoided: true,
      litEstablishments: bestInsights.litEstablishments ?? 0,
      openNowCount: bestInsights.openNowCount ?? 0,
      waypointName: bestInsights.waypointName ?? null,
      nightMode: isNight,
      detourRatio: bestInsights.detourRatio ?? null,
      washroomStops: bestInsights.washroomStops ?? [],
    };

    const steps: RouteStep[] = bestRoute.legs[0].steps.map((s: any) => ({
      instruction: s.html_instructions.replace(/<[^>]*>/g, ''),
      distance: s.distance?.text ?? '',
      duration: s.duration?.text ?? '',
      startLocation: s.start_location,
      maneuver: s.maneuver ?? null,
    }));

    return {
      coords,
      distance: leg.distance?.text ?? null,
      duration: leg.duration?.text ?? null,
      safetyInsights,
      steps,
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

    const steps: RouteStep[] = leg.steps.map((s: any) => ({
      instruction: s.html_instructions.replace(/<[^>]*>/g, ''),
      distance: s.distance?.text ?? '',
      duration: s.duration?.text ?? '',
      startLocation: s.start_location,
      maneuver: s.maneuver ?? null,
    }));

    return {
      coords: decodePolyline(encoded),
      distance: leg.distance?.text || null,
      duration: leg.duration?.text || null,
      steps,
    };
  },
);

/* ........... FLOOD ALERTS ............ */

export const fetchFloodAlerts = createAsyncThunk(
  'maps/fetchFloodAlerts',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=precipitation&forecast_days=1`,
    );

    const data = await res.json();
    const precipitation: number[] = data.hourly?.precipitation || [];
    const maxRain = Math.max(...precipitation);

    if (maxRain > 10) {
      return [
        {
          id: 'flood-live',
          title: 'Flood Risk: Heavy Rain',
          subtitle: `Up to ${maxRain.toFixed(1)}mm expected near you.`,
        },
      ];
    }

    return [];
  },
);

/* ........... CONGESTION ALERTS ............ */

export const fetchCongestionAlerts = createAsyncThunk(
  'maps/fetchCongestionAlerts',
  async ({ lat, lng }: { lat: number; lng: number }) => {
    const GOOGLE_KEY = 'AIzaSyDAaZnQ6p4Zase38K03Rk8LbCyGlfmaUCg';

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${lat},${lng}&departure_time=now&key=${GOOGLE_KEY}`,
    );

    const data = await res.json();
    const leg = data.routes?.[0]?.legs?.[0];

    if (!leg) return [];

    const normalDuration = leg.duration?.value || 0;
    const trafficDuration = leg.duration_in_traffic?.value || 0;
    const delayMinutes = Math.round((trafficDuration - normalDuration) / 60);

    if (delayMinutes > 5) {
      return [
        {
          id: 'congestion-live',
          title: `Congestion: ${delayMinutes} min delay`,
          subtitle: 'Based on current traffic near you.',
        },
      ];
    }

    return [];
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
    steps: [] as RouteStep[],

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
        litEstablishments: number;
        openNowCount: number;
        waypointName: string | null;
        nightMode: boolean;
        detourRatio: number | null;
        washroomStops: string[];
      },
    },

    floodAlerts: [] as { id: string; title: string; subtitle: string }[],
    congestionAlerts: [] as { id: string; title: string; subtitle: string }[],

    loading: false,
    error: null as string | null,
  },

  reducers: {
    clearMapData: state => {
      state.places = [];
      state.safeRouteCoords = [];
      state.normalRouteCoords = [];
      state.steps = [];
      state.safeRouteInfo = {
        distance: null,
        duration: null,
        safetyInsights: null,
      };
      state.normalRouteInfo = { distance: null, duration: null };
      state.error = null;
    },

    // NEW: destination setter
    setDestination: (state, action) => {
      state.destination = action.payload;
      state.safeRouteCoords = [];
      state.normalRouteCoords = [];
      state.steps = [];
      state.safeRouteInfo = {
        distance: null,
        duration: null,
        safetyInsights: null,
      };
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
        state.steps = action.payload.steps || [];
        state.safeRouteInfo = {
          distance: action.payload.distance,
          duration: action.payload.duration,
          safetyInsights: action.payload.safetyInsights || null,
        };
      })

      /* ........ NORMAL ROUTE ........ */

      .addCase(fetchNormalRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.normalRouteCoords = action.payload.coords || [];
        state.steps = action.payload.steps || [];
        state.normalRouteInfo = {
          distance: action.payload.distance,
          duration: action.payload.duration,
        };
      })

      /* ........ FLOOD ALERTS ........ */

      .addCase(fetchFloodAlerts.fulfilled, (state, action) => {
        state.floodAlerts = action.payload;
      })

      /* ........ CONGESTION ALERTS ........ */

      .addCase(fetchCongestionAlerts.fulfilled, (state, action) => {
        state.congestionAlerts = action.payload;
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
