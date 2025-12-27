import Cookies from "js-cookie";

export const setTokens = (data) => {
  Cookies.set("access_token", data.access_token, {
    expires: 1,        // يوم
    sameSite: "strict",
  });

  Cookies.set("token_type", data.token_type || "Bearer", {
    expires: 1,
    sameSite: "strict",
  });

  if (data.refresh_token) {
    Cookies.set("refresh_token", data.refresh_token, {
      expires: 7,      // أسبوع
      sameSite: "strict",
    });
  }
};

export const getAccessToken = () =>
  Cookies.get("access_token");

export const getTokenType = () =>
  Cookies.get("token_type") || "Bearer";

export const getRefreshToken = () =>
  Cookies.get("refresh_token");

export const clearTokens = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("token_type");
};
