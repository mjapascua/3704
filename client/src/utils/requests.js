import axios from "axios";

//export const url = process.env. "http://localhost:5000";
export const api = "/api/";

export const apiClient = axios.create({
  baseURL: api,
  withCredentials: true,
});
