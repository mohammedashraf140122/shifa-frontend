import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../core/api/auth";
import { getRefreshToken, clearTokens } from "../core/utils/token";
import { toast } from "react-toastify";

export const useLogout = (navigate) => {
  return useMutation({
    mutationFn: () => logoutApi(getRefreshToken()),
    onSuccess: () => {
      clearTokens();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: () => {
      // حتى لو فشل السيرفر → نخرج المستخدم
      clearTokens();
      navigate("/login", { replace: true });
    },
  });
};
