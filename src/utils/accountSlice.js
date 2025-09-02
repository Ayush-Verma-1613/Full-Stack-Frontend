import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    deleteResponse: null,
    passwordResponse: null,
  },
  reducers: {
    // ✅ when delete API succeeds
    setDeleteResponse: (state, action) => {
      state.deleteResponse = action.payload;
    },
    clearDeleteResponse: (state) => {
      state.deleteResponse = null;
    },

    // ✅ when change password API succeeds
    setPasswordResponse: (state, action) => {
      state.passwordResponse = action.payload;
    },
    clearPasswordResponse: (state) => {
      state.passwordResponse = null;
    },
  },
});

export const {
  setDeleteResponse,
  clearDeleteResponse,
  setPasswordResponse,
  clearPasswordResponse,
} = accountSlice.actions;

export default accountSlice.reducer;
