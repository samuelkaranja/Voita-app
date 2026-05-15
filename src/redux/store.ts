import { configureStore } from '@reduxjs/toolkit';
import mapsReducer from './slices/map/mapsSlice';
import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';
import userReducer from './slices/user/userSlice';
import vehicleReducer from './slices/vehicle/vehicleSlice';

export const store = configureStore({
  reducer: {
    maps: mapsReducer,
    auth: authReducer,
    profile: profileReducer,
    user: userReducer,
    vehicle: vehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
