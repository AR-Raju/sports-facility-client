import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import { authService } from "@/services/auth"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          const { data: user, token } = response

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          if (typeof window !== "undefined") {
            localStorage.setItem("token", token!)
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: any) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(data)
          const { data: user } = response

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }

        authService.logout().catch(() => {})
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string) => {
        set({ token })
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
        }
      },

      checkAuth: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          const response = await authService.getProfile()
          set({
            user: response.data,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
          if (typeof window !== "undefined") {
            localStorage.removeItem("token")
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
