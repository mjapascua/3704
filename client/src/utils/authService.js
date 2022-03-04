import Cookies from "js-cookie";
import { apiClient } from "./requests";

export const userFromCookie = {
  token: Cookies.get("_token"),
  role: Cookies.get("_ar"),
};

const register = async (userData) => {
  const response = await apiClient.post("user/", userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await apiClient.post("user/login", credentials);
  return response.data;
};

const logout = () => {
  Cookies.remove("_token");
  Cookies.remove("_ar");
};

const ROLES = {
  ADMIN: "b521c",
  EDITOR: "4d3b",
  BASIC: "359d",
};

const authService = { register, login, logout, ROLES };

export default authService;
