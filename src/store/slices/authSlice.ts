import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
  // Store password temporarily for form handling (not recommended for production)
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
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: { email: string; firstName?: string; lastName?: string };
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      // Store token in localStorage
      localStorage.setItem("access_token", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },

    // Signup actions
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: { email: string; firstName?: string; lastName?: string };
      }>
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      // Store token in localStorage
      localStorage.setItem("access_token", action.payload.token);
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },

    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.tempPassword = "";
      state.error = null;
      // Remove token from localStorage
      localStorage.removeItem("access_token");
    },

    // Password management
    setTempPassword: (state, action: PayloadAction<string>) => {
      state.tempPassword = action.payload;
    },
    clearTempPassword: (state) => {
      state.tempPassword = "";
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Initialize auth state from localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
        // You might want to decode the token to get user info
        // For now, we'll set a basic user object
        state.user = { email: "user@example.com" };
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
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
