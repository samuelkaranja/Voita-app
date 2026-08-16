import { configureStore } from '@reduxjs/toolkit';
import mapsReducer from './slices/map/mapsSlice';
import authReducer, {
  logout,
  refreshAccessToken,
} from './slices/auth/authSlice';
import { wireAuthBridge } from '../api/authBridge';
import profileReducer from './slices/profile/profileSlice';
import userReducer from './slices/user/userSlice';
import vehicleReducer from './slices/vehicle/vehicleSlice';
import communityReducer from './slices/community/communitySlice';
import chatReducer from './slices/chat/chatSlice';

import mechanicsReducer from './slices/services/mechanicsSlice';
import carWashReducer from './slices/services/carWashSlice';
import towingReducer from './slices/services/towingSlice';
import scoutsReducer from './slices/services/scoutsSlice';
import exploreReducer from './slices/services/exploreSlice';
import notificationsReducer from './slices/notifications/notificationsSlice';

wireAuthBridge({
  getAuth: () => {
    const { token, tokenExpiresAt } = store.getState().auth;
    return { token, tokenExpiresAt };
  },
  refresh: () => store.dispatch(refreshAccessToken()).unwrap(),
  logout: () => store.dispatch(logout()),
});

export const store = configureStore({
  reducer: {
    maps: mapsReducer,
    auth: authReducer,
    profile: profileReducer,
    user: userReducer,
    vehicle: vehicleReducer,
    community: communityReducer,
    chat: chatReducer,

    mechanics: mechanicsReducer,
    carwash: carWashReducer,
    towing: towingReducer,
    scouts: scoutsReducer,
    explore: exploreReducer,

    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
