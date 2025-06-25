/* eslint-disable @typescript-eslint/no-explicit-any */
import { facilitiesService } from "@/services/facilities";
import type { Facility, FacilityFormData } from "@/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface FacilitiesState {
  facilities: Facility[];
  currentFacility: Facility | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: FacilitiesState = {
  facilities: [],
  currentFacility: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchFacilities = createAsyncThunk(
  "facilities/fetchFacilities",
  async (
    params?: {
      page?: number;
      limit?: number;
      searchTerm?: string;
      location?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Fetching facilities with params:", params);
      const response = await facilitiesService.getAllFacilities(params);
      console.log("Facilities response:", response);
      return {
        facilities: response.data,
        meta: response.meta,
      };
    } catch (error: any) {
      console.error("Facilities fetch error:", error);
      return rejectWithValue(error.message || "Failed to fetch facilities");
    }
  }
);

export const fetchFacilityById = createAsyncThunk(
  "facilities/fetchFacilityById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await facilitiesService.getFacilityById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch facility"
      );
    }
  }
);

export const createFacility = createAsyncThunk(
  "facilities/createFacility",
  async (data: FacilityFormData, { rejectWithValue }) => {
    try {
      const response = await facilitiesService.createFacility(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create facility"
      );
    }
  }
);

export const updateFacility = createAsyncThunk(
  "facilities/updateFacility",
  async (
    { id, data }: { id: string; data: Partial<FacilityFormData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await facilitiesService.updateFacility(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update facility"
      );
    }
  }
);

export const deleteFacility = createAsyncThunk(
  "facilities/deleteFacility",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await facilitiesService.deleteFacility(id);
      return { id, facility: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete facility"
      );
    }
  }
);

const facilitiesSlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFacility: (state) => {
      state.currentFacility = null;
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
    // Fetch facilities
    builder
      .addCase(fetchFacilities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFacilities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.facilities = action.payload.facilities;
        if (action.payload.meta) {
          state.pagination = action.payload.meta;
        }
        state.error = null;
      })
      .addCase(fetchFacilities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch facility by ID
    builder
      .addCase(fetchFacilityById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFacilityById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentFacility = action.payload;
        state.error = null;
      })
      .addCase(fetchFacilityById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create facility
    builder
      .addCase(createFacility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFacility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.facilities.unshift(action.payload);
        state.error = null;
      })
      .addCase(createFacility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update facility
    builder
      .addCase(updateFacility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFacility.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.facilities.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) {
          state.facilities[index] = action.payload;
        }
        if (state.currentFacility?._id === action.payload._id) {
          state.currentFacility = action.payload;
        }
        state.error = null;
      })
      .addCase(updateFacility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete facility
    builder
      .addCase(deleteFacility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFacility.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.facilities.findIndex(
          (f) => f._id === action.payload.id
        );
        if (index !== -1) {
          state.facilities[index] = action.payload.facility;
        }
        state.error = null;
      })
      .addCase(deleteFacility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentFacility, setPagination } =
  facilitiesSlice.actions;
export default facilitiesSlice.reducer;
