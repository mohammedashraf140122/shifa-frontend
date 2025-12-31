import { api } from "./axios";

export const loginApi = async (data) => {
  // The API accepts either username or HRID for login
  // Try username first, if it fails, the backend should handle HRID
  const loginPayload = {
    username: data.username || data.Username || "",
    password: data.password || data.Password || "",
  };
  
  const res = await api.post("/users/login", loginPayload);
  return res.data;
};
 

export const logoutApi = async (refreshToken) => {
  const res = await api.post("/users/logout", {
    refresh_token: refreshToken,
  });
  return res.data;
};