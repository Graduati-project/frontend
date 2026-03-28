"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { login } from "@/services/auth"; // your login function



export function useSignup() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message);
      }
    },
  });
}
export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const creds = data?.data?.credentials;
      if (creds?.access_token) {
        Cookies.set("access_token", creds.access_token);
        if (creds.refresh_token) {
          Cookies.set("refresh_token", creds.refresh_token);
        }
      }
    },
  });
}

export function useSendResetPassword() {

return useMutation({
    mutationFn: sendResetPassword,
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "حدث خطأ");
    },
  });
}
export function useResetPassword() {

return useMutation({
    mutationFn: ResetPassword,
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "حدث خطأ");
    },
  });
}

export function useLogout() {
  return () => {
    // Clear cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    
    // Redirect to login page
    window.location.href = "/auth/login";
  };
}