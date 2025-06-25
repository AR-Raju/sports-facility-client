/* eslint-disable @typescript-eslint/no-explicit-any */
import authService from "@/services/auth";
import type { LoginCredentials, RegisterData, User } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  _persist?: any;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Helper function to set token in both localStorage and cookies
const setTokenStorage = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    // Set cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
};

// Helper function to clear token from both localStorage and cookies
const clearTokenStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    // Clear cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { data: user, token } = response;

      // Store token in localStorage and cookies
      if (token) {
        setTokenStorage(token);
      }

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      // Don't auto-login after registration - just return success
      return { success: true, message: "Registration successful" };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await authService.getProfile();
      return { user: response.data, token };
    } catch (error: any) {
      // Clear token if invalid
      clearTokenStorage();
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      // Clear token from localStorage and cookies
      clearTokenStorage();
      return null;
    } catch (error: any) {
      // Even if logout fails on server, clear local state
      clearTokenStorage();
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setTokenStorage(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearTokenStorage();
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration
    builder.addCase(REHYDRATE as any, (state, action: any) => {
      if (action.payload?.auth) {
        const { user, token, isAuthenticated } = action.payload.auth;
        state.user = user;
        state.token = token;
        state.isAuthenticated = isAuthenticated && !!user;
        state.isLoading = false;
      }
    });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register - Don't auto-login
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Don't set user or isAuthenticated - keep user logged out
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
