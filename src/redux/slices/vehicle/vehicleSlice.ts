import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VehicleState {
  numberPlate: string;
  vehicleType: string;
  year: string;
  color: string;
  oilType: string;
  tirePressure: string;
  tireConfig: string;

  insuranceRenewal: string | null;
  drivingLicenseExpiry: string | null;
  carServiceDate: string | null;
  tireExpiryDate: string | null;

  // ⚠️ IMPORTANT:
  // This must ALWAYS be backend URL (Cloudinary), NOT local file URI
  vehicleImage: string | null;
}

const initialState: VehicleState = {
  numberPlate: '',
  vehicleType: '',
  year: '',
  color: '',
  oilType: '',
  tirePressure: '',
  tireConfig: '',

  insuranceRenewal: null,
  drivingLicenseExpiry: null,
  carServiceDate: null,
  tireExpiryDate: null,

  vehicleImage: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,

  reducers: {
    // ==========================
    // FULL REPLACE (API LOAD)
    // ==========================
    setVehicle(state, action: PayloadAction<VehicleState>) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // ==========================
    // PARTIAL UPDATE (UI / API PATCH)
    // ==========================
    updateVehicle(state, action: PayloadAction<Partial<VehicleState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // ==========================
    // RESET STATE (LOGOUT / CLEAR)
    // ==========================
    clearVehicle() {
      return initialState;
    },
  },
});

export const { setVehicle, updateVehicle, clearVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;
