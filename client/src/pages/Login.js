import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { apiClient } from "../utils/requests";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    remember_me: false,
  });
  const [viewPass, setViewPass] = useState("password");
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  let password_inp = useRef();

  const handleChange = ({ target }) => {
    setCredentials((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleLoginRequest = (e) => {
    e.preventDefault();
    apiClient.post("users/login", credentials).then((res) => {
      res.status === 200 && console.log(res);
    });
  };

  const handlePasswordView = () => {
    const type = password_inp.current.type;
    if (type === "password") {
      return setViewPass("text");
    }
    if (type === "text") {
      return setViewPass("password");
    }
  };

  return (
    <main className="w-screen h-screen flex">
      <div
        className=" bg-white p-7
           w-full
           md:w-1/2
            inline-flex 
            shadow-sm
            flex-col
            text-gray-800
             text-sm 
            "
      >
        <span
          className="text
              w-full border-b pb-5 border-gray-300 mb-5"
        >
          <span
            onClick={() => navigate(from, { replace: true })}
            className="material-icons-sharp flex items-center justify-center rounded-full border-2 h-10 w-10  text-slate-700 border-slate-700 cursor-pointer text-2xl"
          >
            arrow_back
          </span>
          <span className="my-auto w-full text-center block font-bold">
            LOGO
          </span>
        </span>
        <div className="flex justify-center  font-display">
          <form onSubmit={handleLoginRequest} className="px-2 lg:px-4 w-96">
            <span className="my-auto text-lg text-meadow-600 block pb-6 font-bold">
              Login
            </span>
            <div className="data">
              <b>Email</b>
              <input
                type="text"
                name="email"
                autoComplete="username"
                value={credentials.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter email or phone number"
              />
            </div>
            <div className="data relative">
              <b>Password</b>
              <span
                onClick={handlePasswordView}
                className="material-icons-sharp absolute cursor-pointer right-0 text-base px-1"
              >
                {viewPass === "password" ? "visibility_off" : "visibility"}
              </span>
              <input
                type={viewPass}
                autoComplete="current-password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-input"
                required
                ref={password_inp}
                placeholder="Enter password"
              />
            </div>
            <span className="mb-2 inline-flex justify-between w-full">
              <label className="flex items-center mb-5 ">
                Remember me
                <input
                  name="remember_me"
                  value={credentials.remember_me}
                  onChange={(e) =>
                    setCredentials((prev) => {
                      return { ...prev, remember_me: e.target.checked };
                    })
                  }
                  type="checkbox"
                  className="ml-2"
                />
              </label>
              <span className="underline font-semibold text-meadow-700">
                <a href="#">Forgot Password?</a>
              </span>
            </span>
            <Button
              type={"submit"}
              classes={"block w-full mb-5 h-11 bg-meadow-600 text-white"}
            >
              LOGIN
            </Button>{" "}
            <span className="border-b border-gray-300 mb-4 block w-full"></span>
            <span className="w-fit block mx-auto mb-4">Not a member?</span>
            <Button
              classes={
                "block w-full h-11 border border-meadow-600 text-meadow-600"
              }
              onClick={() => navigate("/signup", { replace: true })}
            >
              SIGN UP
            </Button>
          </form>
        </div>
      </div>
      <div className="w-1/2  bg-meadow-700  inline-block"></div>
    </main>
  );
}

export default Login;
