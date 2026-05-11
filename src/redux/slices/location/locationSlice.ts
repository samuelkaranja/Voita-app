import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    currentLocation: null,
    speed: 0,
  },
  reducers: {
    setLocation: (state, action) => {
      state.currentLocation = action.payload.coords;
      state.speed = action.payload.coords.speed || 0;
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
