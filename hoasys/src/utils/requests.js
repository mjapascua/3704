import axios from "axios";

export const url = "http://localhost:5000";
export const api = url + "/api/";
export const apiClient = axios.create({
  baseURL: api,
  withCredentials: true,
});
