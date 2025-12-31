import {
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../core/api/axios";
import { getAccessToken } from "../core/utils/token";

const AuthContext = createContext(null);

const USER_QUERY_KEY = ["user", "me"];

/* ================= FETCH USER ================= */
const fetchUserData = async () => {
  const res = await api.get("/users/me");
  return res.data.user;
};

/* ================= BUILD PERMISSIONS MAP ================= */
const buildPermissionsMap = (user) => {
  const map = {};

  if (!user?.modules) return map;

  user.modules.forEach((module) => {
    if (!map[module.moduleName]) {
      map[module.moduleName] = {};
    }

    module.subModules?.forEach((sub) => {
      map[module.moduleName][sub.subModuleName] =
        sub.permissions?.map(p => p.permissionName) || [];
    });
  });

  return map;
};

/* ================= PROVIDER ================= */
export const AuthProvider = ({ children }) => {
  const hasToken = !!getAccessToken();

  const {
    data: user,
    isLoading: loading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await api.get("/users/me");
        return res.data.user;
      } catch (error) {
        // Log error for debugging
        console.error("Failed to fetch user:", error);
        throw error;
      }
    },
    enabled: hasToken,
    retry: (failureCount, error) => {
      // Retry logic: retry up to 2 times for network errors (5xx)
      if (failureCount < 2 && error?.response?.status >= 500) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 0, // Always consider data stale to ensure fresh data on mount
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus (better UX)
    refetchOnReconnect: true, // Refetch on reconnect (important for network issues)
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes after unused
  });

  const permissionsMap = useMemo(
    () => buildPermissionsMap(user),
    [user]
  );

  const memoizedRefetch = useCallback(() => refetch(), [refetch]);

  // Combine loading and isFetching for accurate state
  // isFetching = true when refetching even if data exists
  const isLoading = loading || isFetching;

  const value = useMemo(
    () => ({
      user: user || null,
      permissionsMap,
      loading: isLoading, // Use combined loading state
      error,
      hasToken,
      isAdmin: user?.isAdmin || false,
      refetch: memoizedRefetch,
    }),
    [user, permissionsMap, isLoading, error, hasToken, memoizedRefetch]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default values if context is not available
    return {
      user: null,
      permissionsMap: {},
      loading: true,
      error: null,
      hasToken: false,
      isAdmin: false,
      refetch: () => Promise.resolve(),
    };
  }
  return context;
};
