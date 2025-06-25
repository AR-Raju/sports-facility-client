"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  checkAuth,
  clearError,
  loginUser,
  logoutUser,
  registerUser,
} from "@/store/slices/authSlice";
import type { LoginCredentials, RegisterData } from "@/types";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Only check auth if we have a token but no user (after rehydration or page refresh)
    if (storedToken && !user && !isLoading) {
      dispatch(checkAuth());
    }
  }, [dispatch, user, isLoading]);

  const login = async (email: string, password: string) => {
    const credentials: LoginCredentials = { email, password };
    const result = await dispatch(loginUser(credentials));
    if (loginUser.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
    return result.payload;
  };

  const register = async (data: RegisterData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
    return result.payload;
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated && !!user,
    error,
    login,
    register,
    logout,
    clearError: clearAuthError,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
};
