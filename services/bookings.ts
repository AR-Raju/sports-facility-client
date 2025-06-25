import api from "@/lib/api";
import type { ApiResponse, Booking, BookingFormData, TimeSlot } from "@/types";

export const bookingsService = {
  async createBooking(data: BookingFormData): Promise<ApiResponse<Booking>> {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  async getUserBookings(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Booking[]>> {
    const response = await api.get("/user/bookings", { params });
    return response.data;
  },

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    const response = await api.delete(`/user/bookings/${id}`);
    return response.data;
  },

  async getAllBookings(params?: {
    page?: number;
    limit?: number;
    date?: string;
    isBooked?: string;
  }): Promise<ApiResponse<Booking[]>> {
    const response = await api.get("/bookings", { params });
    return response.data;
  },

  async updateBookingStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<Booking>> {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  async checkAvailability(params: {
    date: string;
    facility?: string;
  }): Promise<ApiResponse<TimeSlot[]>> {
    const response = await api.get("/check-availability", { params });
    return response.data;
  },
};
