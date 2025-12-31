import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../core/api/auth";
import { setTokens } from "../core/utils/token";
import { toast } from "react-toastify";

export const useLogin = (navigate) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Handle different response structures
      const tokenData = data?.data || data;
      setTokens(tokenData); // 👈 access + refresh + token_type
      
      // Small delay to ensure token is saved before navigation
      setTimeout(() => {
        toast.success("Login successful");
        navigate("/dashboard");
      }, 100);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    },
  });
};
