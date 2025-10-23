// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  tempPassword: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: localStorage.getItem("access_token"),
  user: null,
  tempPassword: "",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: {
          id: string;
          email: string;
          createdAt?: string;
          updatedAt?: string;
          firstName?: string;
          lastName?: string;
        };
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem("access_token", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: {
          id: string;
          email: string;
          createdAt?: string;
          updatedAt?: string;
          firstName?: string;
          lastName?: string;
        };
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem("access_token", action.payload.token);
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.tempPassword = "";
      state.error = null;
      localStorage.removeItem("access_token");
    },
    setTempPassword: (state, action: PayloadAction<string>) => {
      state.tempPassword = action.payload;
    },
    clearTempPassword: (state) => {
      state.tempPassword = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    resetLoading: (state) => {
      state.loading = false;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
        // Optionally fetch user data from /auth/me or decode token
        state.user = {
          id: "",
          email: "",
          createdAt: "",
          updatedAt: "",
        };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
  setTempPassword,
  clearTempPassword,
  clearError,
  resetLoading,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
