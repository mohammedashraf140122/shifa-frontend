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

export const api = axios.create({
  baseURL: "http://192.168.10.30:7000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   REQUEST INTERCEPTOR
============================ */

// attach token_type from backend (Bearer / etc...)
api.interceptors.request.use((config) => {
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post(
          "/users/refresh-token",
          {
            refresh_token: getRefreshToken(),
          },
          {
            headers: {
              Authorization: `${getTokenType()} ${getAccessToken()}`,
            },
          }
        );

        setTokens(res.data);

        originalRequest.headers.Authorization = `${res.data.token_type} ${res.data.access_token}`;

        return api(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ============================
   BRANCHES API
============================ */

/**
 * GET all branches
 */
export const getBranches = () => {
  return api.get("/users/branches");
};

/**
 * ADD new branches
 * @param [{ BranchName: string }]
 */
// ADD new branches
export const addBranches = (branches) => {
  // [{ BranchName, BranchNameAr }]
  return api.put("/users/branches", branches);
};

// UPDATE existing branches
export const updateBranches = (branches) => {
  // [{ BranchID, NewName, NewNameAr }]
  return api.post("/users/branches", branches);
};



// ================= MODULES API =================

// Get all modules
export const getModules = () => {
  return api.get("/users/modules");
};

// Add modules
export const addModules = (modules) => {
  // [{ ModuleName, ModuleNameAr }]
  return api.put("/users/modules", modules);
};

// Update modules
export const updateModules = (modules) => {
  // [{ ModuleID, NewName, NewNameAr }]
  return api.post("/users/modules", modules);
};

// Delete modules
export const deleteModules = (ids) => {
  const query = ids.join(",");
  return api.delete(`/users/modules?ModuleID=${query}`);
};


// ================= SUB MODULES API =================

// Get all sub modules (optionally by moduleId)
export const getSubModules = (moduleId) => {
  const url = moduleId
    ? `/users/subModules?moduleId=${moduleId}`
    : "/users/subModules";
  return api.get(url);
};

// Add sub modules
export const addSubModules = (subModules) => {
  // [{ ModuleID, SubModuleName, SubModuleNameAr }]
  return api.put("/users/subModules", subModules);
};

// Update sub modules
export const updateSubModules = (subModules) => {
  // [{ SubModuleID, NewName?, NewNameAr? }]
  return api.post("/users/subModules", subModules);
};

// Delete sub modules
export const deleteSubModules = (ids) => {
  const query = ids.join(",");
  return api.delete(`/users/subModules?SubModuleID=${query}`);
};
