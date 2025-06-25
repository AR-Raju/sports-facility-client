/* eslint-disable @typescript-eslint/no-explicit-any */
import { bookingsService } from "@/services/bookings";
import type { Booking, BookingFormData, TimeSlot } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  availableSlots: TimeSlot[];
  isLoading: boolean;
  isCreating: boolean;
  isCancelling: string | null;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: BookingsState = {
  bookings: [],
  userBookings: [],
  availableSlots: [],
  isLoading: false,
  isCreating: false,
  isCancelling: null,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (data: BookingFormData, { rejectWithValue }) => {
    try {
      const response = await bookingsService.createBooking(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (params: { page?: number; limit?: number } | undefined, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await bookingsService.getUserBookings(params);
      return {
        bookings: response.data,
        meta: response.meta,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user bookings"
      );
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAllBookings",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          date?: string;
          isBooked?: string;
        }
      | undefined,
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await bookingsService.getAllBookings(params);
      return {
        bookings: response.data,
        meta: response.meta,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await bookingsService.cancelBooking(id);
      return { id, booking: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async (params: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await bookingsService.updateBookingStatus(
        params.id,
        params.status
      );
      return { id: params.id, booking: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  }
);

export const checkAvailability = createAsyncThunk(
  "bookings/checkAvailability",
  async (params: { date: string; facility?: string }, { rejectWithValue }) => {
    try {
      const response = await bookingsService.checkAvailability(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check availability"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableSlots: (state) => {
      state.availableSlots = [];
    },
    setPagination: (
      state,
      action: PayloadAction<{ page: number; limit: number }>
    ) => {
      state.pagination.page = action.payload.page;
      state.pagination.limit = action.payload.limit;
    },
  },
  extraReducers: (builder) => {
    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreating = false;
        state.userBookings.unshift(action.payload);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Fetch user bookings
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBookings = action.payload.bookings;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
        state.error = null;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch all bookings (admin)
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
        state.error = null;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state, action) => {
        state.isCancelling = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isCancelling = null;

        // Update user bookings
        const userIndex = state.userBookings.findIndex(
          (b) => b._id === action.payload.id
        );
        if (userIndex !== -1) {
          state.userBookings[userIndex] = action.payload.booking;
        }

        // Update all bookings
        const allIndex = state.bookings.findIndex(
          (b) => b._id === action.payload.id
        );
        if (allIndex !== -1) {
          state.bookings[allIndex] = action.payload.booking;
        }

        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isCancelling = null;
        state.error = action.payload as string;
      });

    // Check availability
    builder
      .addCase(checkAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
        state.error = null;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAvailableSlots, setPagination } =
  bookingsSlice.actions;
export default bookingsSlice.reducer;
