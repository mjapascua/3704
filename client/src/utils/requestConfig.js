import { store } from "../store/store";
import { userFromCookie } from "./authService";

export let authConfig = () => {
  return {
    headers: {
      Authorization: "Bearer " + store.getState().auth.user,
    },
  };
};
