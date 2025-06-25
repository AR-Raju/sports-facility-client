import api from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  admins: number;
}

export const usersService = {
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse<User[]>> {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  async updateUserStatus(
    id: string,
    status: "active" | "suspended"
  ): Promise<ApiResponse<User>> {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await api.get("/admin/users/stats");
    return response.data;
  },
};
