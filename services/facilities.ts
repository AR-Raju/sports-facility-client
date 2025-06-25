/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import type { ApiResponse, Facility, FacilityFormData } from "@/types";

export const facilitiesService = {
  async getAllFacilities(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sort?: string;
  }): Promise<ApiResponse<Facility[]>> {
    try {
      console.log("API call to /facilities with params:", params);
      const response = await api.get("/facilities", { params });
      console.log("API response:", response.data);

      // Handle different response structures
      if (response.data.success) {
        return response.data;
      } else {
        // If the API returns data directly without success wrapper
        return {
          success: true,
          message: "Facilities fetched successfully",
          data: response.data,
          meta: {
            page: params?.page || 1,
            limit: params?.limit || 12,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 12)),
          },
        };
      }
    } catch (error: any) {
      console.error("Facilities service error:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch facilities"
      );
    }
  },

  async getFacilityById(id: string): Promise<ApiResponse<Facility>> {
    const response = await api.get(`/facilities/${id}`);
    return response.data;
  },

  async createFacility(data: FacilityFormData): Promise<ApiResponse<Facility>> {
    const response = await api.post("/facilities", data);
    return response.data;
  },

  async updateFacility(
    id: string,
    data: Partial<FacilityFormData>
  ): Promise<ApiResponse<Facility>> {
    const response = await api.put(`/facilities/${id}`, data);
    return response.data;
  },

  async deleteFacility(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/facilities/${id}`);
    return response.data;
  },

  // Admin specific endpoints
  async getAdminFacilities(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }): Promise<ApiResponse<Facility[]>> {
    const response = await api.get("/admin/facilities", { params });
    return response.data;
  },
};
