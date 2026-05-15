import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl: string | null;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  profileImageUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    // =========================
    // SET FULL USER (LOGIN / INIT)
    // =========================
    setUser: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.profileImageUrl = action.payload.profileImageUrl ?? null;
    },

    // =========================
    // PARTIAL UPDATE (PROFILE EDIT)
    // =========================
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      if (action.payload.firstName !== undefined)
        state.firstName = action.payload.firstName;

      if (action.payload.lastName !== undefined)
        state.lastName = action.payload.lastName;

      if (action.payload.email !== undefined)
        state.email = action.payload.email;

      if (action.payload.phone !== undefined)
        state.phone = action.payload.phone;

      if (action.payload.profileImageUrl !== undefined)
        state.profileImageUrl = action.payload.profileImageUrl ?? null;
    },

    // =========================
    // CLEAR USER (LOGOUT)
    // =========================
    clearUser: () => initialState,
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
