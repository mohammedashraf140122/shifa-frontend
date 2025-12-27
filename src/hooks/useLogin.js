import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../core/api/auth";
import { setTokens } from "../core/utils/token";
import { toast } from "react-toastify";

export const useLogin = (navigate) => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setTokens(data); // 👈 access + refresh + token_type
      toast.success("Login successful");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    },
  });
};
