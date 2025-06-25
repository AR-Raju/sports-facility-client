export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  address: string
  createdAt: string
  updatedAt: string
}

export interface Facility {
  _id: string
  name: string
  description: string
  pricePerHour: number
  location: string
  image?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Booking {
  _id: string
  date: string
  startTime: string
  endTime: string
  user: User
  facility: Facility
  payableAmount: number
  isBooked: "confirmed" | "unconfirmed" | "canceled"
  paymentStatus: "pending" | "paid" | "failed"
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export interface TimeSlot {
  startTime: string
  endTime: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  token?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  address: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface BookingFormData {
  facility: string
  date: string
  startTime: string
  endTime: string
}

export interface FacilityFormData {
  name: string
  description: string
  pricePerHour: number
  location: string
  image?: string
}
