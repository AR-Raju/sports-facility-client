import api from "@/lib/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<ApiResponse<User>> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  async getUser(): Promise<ApiResponse<User>> {
    const response = await api.get("/auth/me");
    return response.data;
  },
  async registerAdmin(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<ApiResponse<User>> {
    const response = await api.post("/auth/admin/register", data);
    return response.data;
  },
};

export default authService;
