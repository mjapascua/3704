import { store } from "../store/store";

export let authConfig = () => {
  return {
    headers: {
      Authorization: "Bearer " + store.getState().auth.user,
    },
  };
};
