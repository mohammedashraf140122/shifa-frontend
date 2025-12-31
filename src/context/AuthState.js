import { useMemo, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../core/api/axios";
import { getAccessToken } from "../core/utils/token";
import { toast } from "react-toastify";

export const USER_QUERY_KEY = ["user", "me"];

const fetchUserData = async () => {
  const res = await api.get("/users/me");
  return res.data.user;
};

const buildPermissionsMap = (userData) => {
  const map = {};
  let permissions = [];

  if (Array.isArray(userData?.permissions)) {
    permissions = userData.permissions;
  } else if (Array.isArray(userData?.modules)) {
    userData.modules.forEach(m => {
      if (Array.isArray(m.subModules)) {
        m.subModules.forEach(sm => {
          if (Array.isArray(sm.permissions)) {
            permissions.push({
              moduleName: m.moduleName,
              subModuleName: sm.subModuleName,
              permissions: sm.permissions,
            });
          }
        });
      }
    });
  }

  permissions.forEach(p => {
    if (!map[p.moduleName]) map[p.moduleName] = {};
    if (!map[p.moduleName][p.subModuleName]) {
      map[p.moduleName][p.subModuleName] = [];
    }

    p.permissions.forEach(per => {
      if (per.permissionName) {
        map[p.moduleName][p.subModuleName].push(per.permissionName);
      }
    });
  });

  return map;
};

export function useAuthState() {
  const hasToken = useMemo(() => !!getAccessToken(), []);

  const {
    data: user,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUserData,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const permissionsMap = useMemo(
    () => (user ? buildPermissionsMap(user) : {}),
    [user]
  );

  const memoizedRefetch = useCallback(() => refetch(), [refetch]);

  return {
    user,
    permissionsMap,
    loading,
    error,
    hasToken,
    isAdmin: user?.isAdmin || false,
    isManager: user?.isManager || false,
    refetch: memoizedRefetch,
  };
}
