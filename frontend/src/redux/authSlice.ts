import api from "@/api/axiosInstance";
import type { AuthState, AuthUser } from "@/features/auth/types/auth.types";
import { apiErrors } from "@/shared/utils/errorHandler";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  userData: null,
  error: null,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/auth/me")
    console.log(response.data.user);
    return response?.data?.user
  } catch (error: unknown) {
    console.log(error)
    const err = apiErrors(error)
    return rejectWithValue(err?.error)
  }
})


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.userData = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearUser(state) {
      state.userData = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.userData = null;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
