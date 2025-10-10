// Re-export everything from store for easier imports
export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";

// Export all auth actions for easier imports
export {
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
} from "./slices/authSlice";
