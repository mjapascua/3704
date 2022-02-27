import Cookies from "js-cookie";

const { apiClient } = require("./requests");

export const userFromCookie = Cookies.get("_token");

console.log(userFromCookie);

export const authConfig = {
  headers: {
    Authorization: "Bearer " + userFromCookie,
  },
};

const register = async (userData) => {
  const response = await apiClient.post("users/", userData, authConfig);

  return response.data;
};

const login = async (credentials) => {
  const response = await apiClient.post("users/login", credentials, authConfig);

  return response.data;
};

const logout = () => {
  Cookies.remove("_token");
};

const authService = { register, login, logout };

export default authService;
