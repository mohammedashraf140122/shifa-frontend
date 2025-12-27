import { api } from "./axios";

export const loginApi = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};
 

export const logoutApi = async (refreshToken) => {
  const res = await api.post("/users/logout", {
    refresh_token: refreshToken,
  });
  return res.data;
};