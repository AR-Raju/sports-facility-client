/* eslint-disable @typescript-eslint/no-explicit-any */
import authService from "@/services/auth";
import { usersService, type UserStats } from "@/services/users";
import type { User } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface UsersState {
  users: User[];
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: UsersState = {
  users: [],
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    args: {
      params?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
        role?: string;
        status?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await usersService.getAllUsers(args.params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "users/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersService.getUserStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user stats"
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async (
    { id, status }: { id: string; status: "active" | "suspended" },
    { rejectWithValue }
  ) => {
    try {
      const response = await usersService.updateUserStatus(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await usersService.deleteUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const createAdmin = createAsyncThunk(
  "users/createAdmin",
  async (
    data: {
      name: string;
      email: string;
      password: string;
      phone: string;
      address: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.registerAdmin(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<typeof initialState.pagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch User Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update User Status
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });

    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    });

    // Create Admin
    builder
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setPagination } = usersSlice.actions;
export default usersSlice.reducer;
