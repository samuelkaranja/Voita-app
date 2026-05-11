import { configureStore } from '@reduxjs/toolkit';
import mapsReducer from './slices/map/mapsSlice';
import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';

export const store = configureStore({
  reducer: {
    maps: mapsReducer,
    auth: authReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
