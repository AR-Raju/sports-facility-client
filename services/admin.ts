/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface AdminStats {
  totalUsers: number;
  totalFacilities: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: any[];
  popularFacilities: any[];
  monthlyRevenue: any[];
  bookingTrends: any[];
}

export interface DashboardData {
  stats: AdminStats;
  recentActivity: any[];
  notifications: any[];
}

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }): Promise<ApiResponse<any>> {
    const response = await api.get("/admin/analytics", { params });
    return response.data;
  },
};
