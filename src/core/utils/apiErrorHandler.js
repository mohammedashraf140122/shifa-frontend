import { toast } from "react-toastify";
import { clearTokens } from "./token";
import { devError } from "./devLog";

/**
 * Central API Error Handler
 * Handles different error statuses with appropriate actions
 */
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    customMessages = {},
    on401,
    on403,
    on500,
    on502,
    on503,
  } = options;

  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.message || "حدث خطأ غير متوقع";

  // Log error in development
  devError("API Error:", { status, message, error });

  // Handle specific status codes
  switch (status) {
    case 401:
      // Unauthorized - clear tokens and redirect
      clearTokens();
      if (on401) {
        on401(error);
      } else if (showToast) {
        toast.error(customMessages[401] || "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.");
      }
      // Redirect handled by axios interceptor
      break;

    case 403:
      // Forbidden - permission denied
      if (on403) {
        on403(error);
      } else if (showToast) {
        toast.error(customMessages[403] || "ليس لديك صلاحية للوصول إلى هذا المورد.");
      }
      break;

    case 500:
      // Internal Server Error
      if (on500) {
        on500(error);
      } else if (showToast) {
        toast.error(customMessages[500] || "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.");
      }
      break;

    case 502:
      // Bad Gateway
      if (on502) {
        on502(error);
      } else if (showToast) {
        toast.error(
          customMessages[502] || "الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.",
          { autoClose: 5000 }
        );
      }
      break;

    case 503:
      // Service Unavailable
      if (on503) {
        on503(error);
      } else if (showToast) {
        toast.error(
          customMessages[503] || "الخدمة غير متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.",
          { autoClose: 5000 }
        );
      }
      break;

    case 429:
      // Too Many Requests
      if (showToast) {
        toast.error(
          customMessages[429] || "تم تجاوز الحد المسموح. يرجى الانتظار قليلاً والمحاولة مرة أخرى.",
          { autoClose: 5000 }
        );
      }
      break;

    default:
      // Generic error
      if (showToast) {
        toast.error(message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
  }

  return { status, message };
};

/**
 * Wrapper for async functions to automatically handle errors
 */
export const withErrorHandling = (asyncFn, options = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleApiError(error, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };
};





