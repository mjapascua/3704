import React, { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiClient } from "../utils/requests";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signIn = (credentials, successCallback, errorCallback) => {
    apiClient
      .post("users/login", credentials)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data._id);
          typeof successCallback === "function" && successCallback();
        }
      })
      .catch(
        (err) => typeof errorCallback === "function" && errorCallback(err)
      );
  };
  const value = { user, signIn };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

const Protected = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export { AuthContext, useAuth, Protected };
export default AuthProvider;
