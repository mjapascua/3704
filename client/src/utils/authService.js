import Cookies from "js-cookie";
import { apiClient } from "./requests";

export const userFromCookie = Cookies.get("_token");

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
};

const authService = { register, login, logout };

export default authService;
