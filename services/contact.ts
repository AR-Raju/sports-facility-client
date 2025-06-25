import api from "@/lib/api"
import type { ApiResponse, ContactFormData } from "@/types"

export const contactService = {
  async submitContact(data: ContactFormData): Promise<ApiResponse<any>> {
    const response = await api.post("/contact", data)
    return response.data
  },
}
