import { configureStore } from '@reduxjs/toolkit';
import mapsReducer from './slices/map/mapsSlice';
import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';
import userReducer from './slices/user/userSlice';
import vehicleReducer from './slices/vehicle/vehicleSlice';

import mechanicsReducer from './slices/services/mechanicsSlice';
import carWashReducer from './slices/services/carWashSlice';
import towingReducer from './slices/services/towingSlice';
import scoutsReducer from './slices/services/scoutsSlice';
import exploreReducer from './slices/services/exploreSlice';

export const store = configureStore({
  reducer: {
    maps: mapsReducer,
    auth: authReducer,
    profile: profileReducer,
    user: userReducer,
    vehicle: vehicleReducer,

    mechanics: mechanicsReducer,
    carwash: carWashReducer,
    towing: towingReducer,
    scouts: scoutsReducer,
    explore: exploreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
