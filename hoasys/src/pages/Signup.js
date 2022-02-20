import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { apiClient } from "../utils/requests";
function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";

  const handleChange = ({ target }) => {
    setCredentials((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleSignUpRequest = (e) => {
    e.preventDefault();
    apiClient.post("login", credentials).then((res) => {
      res.status === 200 && console.log(res);
    });
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
            text-sm
            text-gray-800
            "
      >
        <span
          className="text
              w-full border-b pb-5 border-gray-300 mb-5"
        >
          <span
            onClick={() => navigate(from, { replace: true })}
            className="material-icons-sharp cursor-pointer text-3xl text-gray-700"
          >
            arrow_back
          </span>
          <span className="my-auto w-full text-center block font-bold">
            LOGO
          </span>
        </span>
        <div className="flex justify-center font-display">
          <form action="#" className="px-2 lg:px-4 w-96">
            <span className="my-auto text-lg text-meadow-600 block pb-4 font-bold">
              Sign up
            </span>
            <div className="data">
              <label>Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={credentials.email}
                className="form-input"
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="data">
              <label>Phone</label>
              <input
                name="cellphone"
                type="text"
                name="phone_number"
                onChange={handleChange}
                value={credentials.phone_number}
                className="form-input"
                placeholder="639+"
                required
              />
            </div>
            <div className="flex flex-col md:flex-row">
              <label className="md:mr-1 md:w-44">
                Password
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={credentials.password}
                  autoComplete="current-password"
                  className="form-input"
                  placeholder="Atleast 8 characters"
                  required
                />
              </label>

              <label className="md:ml-1 md:w-44">
                Confirm password
                <input
                  type="password"
                  name="password_confirm"
                  onChange={handleChange}
                  value={credentials.password_confirm}
                  autoComplete="current-password"
                  className="form-input"
                  placeholder="Passwords must match"
                  required
                />
              </label>
            </div>
            <Button
              classes={"block mt-5 mb-5 w-full h-11 bg-meadow-600 text-white"}
            >
              SIGN UP
            </Button>
            <span className="border-b border-gray-300 mb-4 block w-full"></span>
            <span className="w-fit block mx-auto mb-4">Already a member?</span>
            <Button
              classes={
                "block w-full h-11 border border-meadow-700 text-meadow-700"
              }
              onClick={() => navigate("/login", { replace: true })}
            >
              LOG IN
            </Button>
          </form>
        </div>
      </div>
      <div className="w-1/2  bg-meadow-700  inline-block"></div>
    </main>
  );
}

export default Login;
