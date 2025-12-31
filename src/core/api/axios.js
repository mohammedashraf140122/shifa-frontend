import axios from "axios";
import {
  getAccessToken,
  getTokenType,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/token";

/* ============================
   AXIOS INSTANCE
============================ */

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.10.30:7000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */

api.interceptors.request.use((config) => {
  // Don't add token to login endpoint
  if (config.url?.includes("/users/login")) {
    return config;
  }

  const token = getAccessToken();
  const type = getTokenType();

  if (token) {
    config.headers.Authorization = `${type} ${token}`;
  }

  return config;
});

/* ============================
   RESPONSE INTERCEPTOR
============================ */

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - token expired or invalid
    // Note: 403 (Forbidden) is handled by components - don't logout/redirect on 403
    // 403 means user is authenticated but lacks permission for the resource
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      
      // If no refresh token, clear and redirect
      if (!refreshToken) {
        clearTokens();
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const res = await api.post(
          "/users/refresh-token",
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `${getTokenType()} ${getAccessToken()}`,
            },
          }
        );

        setTokens(res.data);
        originalRequest.headers.Authorization =
          `${res.data.token_type} ${res.data.access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect
        clearTokens();
        // Only redirect if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* ============================
   BRANCHES API
============================ */

export const getBranches = () => api.get("/users/branches");

export const addBranches = (branches) =>
  api.put("/users/branches", branches);

export const updateBranches = (branches) =>
  api.post("/users/branches", branches);

/* ============================
   MODULES API
============================ */

export const getModules = () => api.get("/users/modules");

export const addModules = (modules) =>
  api.put("/users/modules", modules);

export const updateModules = (modules) =>
  api.post("/users/modules", modules);

export const deleteModules = (ids) =>
  api.delete(`/users/modules?ModuleID=${ids.join(",")}`);

/* ============================
   SUB MODULES API
============================ */

export const getSubModules = (moduleId) => {
  const url = moduleId
    ? `/users/subModules?moduleId=${moduleId}`
    : "/users/subModules";
  return api.get(url);
};

export const addSubModules = (subModules) =>
  api.put("/users/subModules", subModules);

export const updateSubModules = (subModules) =>
  api.post("/users/subModules", subModules);

export const deleteSubModules = (ids) =>
  api.delete(`/users/subModules?SubModuleID=${ids.join(",")}`);

/* ============================
   PERMISSIONS API
============================ */

export const getPermissions = () => api.get("/users/permissions");

export const addPermissions = (permissions) =>
  api.put("/users/permissions", permissions);

export const updatePermissions = (permissions) =>
  api.post("/users/permissions", permissions);

export const deletePermissions = (ids) =>
  api.delete(`/users/permissions?PermissionID=${ids.join(",")}`);

/* ============================
   ROLES API
============================ */

export const getRoles = () => api.get("/users/roles");

export const addRoles = (roles) =>
  api.put("/users/roles", roles);

export const updateRoles = (roles) =>
  api.post("/users/roles", roles);

export const deleteRoles = (ids) =>
  api.delete(
    `/users/roles?RoleID=${Array.isArray(ids) ? ids.join(",") : ids}`
  );

/* ============================
   ROLE PERMISSIONS API
============================ */

export const getRolePermissions = (roleId) => {
  const url = roleId
    ? `/users/rolePermissions?RoleID=${roleId}`
    : "/users/rolePermissions";
  return api.get(url);
};

export const addRolePermissions = (rolePermissions) =>
  api.put("/users/rolePermissions", rolePermissions);

export const updateRolePermissions = (rolePermissions) =>
  api.post("/users/rolePermissions", rolePermissions);

export const deleteRolePermissions = (ids) =>
  api.delete(`/users/rolePermissions?RolePermissionID=${ids.join(",")}`);

/* ============================
   USER ROLES API  ⭐⭐ (الجديد)
============================ */

// Get all user roles OR by UserId
export const getUserRoles = (userId) => {
  const url = userId
    ? `/users/userRoles?UserId=${userId}`
    : "/users/userRoles";
  return api.get(url);
};

// Add user roles (single / multiple)
export const addUserRoles = (userRoles) => {
  // [{ UserId, RoleId, SubModuleID }]
  return api.put("/users/userRoles", userRoles);
};

// Update user roles
export const updateUserRoles = (userRoles) => {
  return api.post("/users/userRoles", userRoles);
};

// Delete user roles
export const deleteUserRoles = ({ UserId, RoleId, SubModuleID }) => {
  return api.delete(
    `/users/userRoles?UserId=${UserId}&RoleId=${RoleId}&SubModuleID=${SubModuleID}`
  );
};

/* ============================
   USERS API
============================ */

export const getUsers = (userId) => {
  const url = userId
    ? `/users/users?UserId=${userId}`
    : "/users/users";
  return api.get(url);
};

export const addUserApi = (user) =>
  api.put("/users/users", [user]);

export const updateUserApi = (user) =>
  api.post("/users/users", [user]);

export const deleteUserApi = (userId) =>
  api.delete(`/users/users?UserId=${userId}`);
