import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { apiClient } from "../utils/requests";
function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });
  const [progress, setProgress] = useState(1);
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
    apiClient.post("register", credentials).then((res) => {
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
            className="material-icons-sharp flex items-center justify-center rounded-full border-2 h-10 w-10  text-slate-700 border-slate-700 cursor-pointer text-2xl"
          >
            arrow_back
          </span>
          <span className="my-auto w-full text-center block font-bold">
            LOGO
          </span>
        </span>
        <div className="flex justify-center font-display">
          <form
            onSubmit={handleSignUpRequest}
            className="px-2 lg:px-4 w-96 block mx-10"
          >
            <span className="my-auto text-lg text-meadow-600 block pb-4 font-bold">
              Sign up
            </span>

            {progress === 1 && (
              <div className=" animate-slideToR h-60 bg-white">
                <div className="data">
                  <label>
                    First Name
                    <input
                      type="text"
                      name="first_name"
                      onChange={handleChange}
                      value={credentials.first_name}
                      className="form-input"
                      placeholder="Enter first name"
                      required
                    />
                  </label>
                </div>
                <div className="data relative">
                  <label>
                    Last Name
                    <span className="flex">
                      <input
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        value={credentials.last_name}
                        className="form-input"
                        placeholder="Enter last name"
                        required
                      />
                    </span>
                  </label>
                </div>
              </div>
            )}
            {progress === 2 && (
              <div className=" animate-slideToR h-60 bg-white">
                <div>
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
                <div className=" relative">
                  <label>
                    Phone
                    <span className="flex">
                      <span className="px-1 mr-2 py-4 text-base inline-block">
                        <>+63</>
                      </span>
                      <input
                        type="text"
                        name="phone_number"
                        onChange={handleChange}
                        value={credentials.phone_number}
                        className="form-input !inline-block"
                        placeholder="9*********"
                        required
                      />
                    </span>
                  </label>
                </div>
              </div>
            )}
            {progress === 3 && (
              <div className=" animate-slideToR h-60 bg-white">
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
                <Button
                  type={"submit"}
                  classes={
                    "block mt-5 mb-5 w-full h-11 bg-meadow-600 text-white"
                  }
                >
                  SIGN UP
                </Button>
              </div>
            )}
            <span className="w-full inline-block h-6 select-none relative text-lg text-meadow-600">
              {progress > 1 && (
                <span
                  className="cursor-pointer absolute left-0 underline"
                  onClick={() => setProgress(progress - 1)}
                >
                  Back
                </span>
              )}
              {progress < 3 && (
                <span
                  className="cursor-pointer absolute right-0 underline"
                  onClick={() => setProgress(progress + 1)}
                >
                  Next
                </span>
              )}
            </span>
            <span className="block text-center border-b border-gray-300 py-3 mb-4 w-full">
              {[1, 2, 3].map((num) => {
                return (
                  <span
                    key={num}
                    onClick={() => setProgress(num)}
                    className={
                      (progress >= num ? " bg-meadow-500" : "bg-gray-300") +
                      (progress === num ? " w-7 " : " w-2.5") +
                      " transition mr-2 rounded-xl inline-block w-2.5 h-2.5 bg-gray-300"
                    }
                  ></span>
                );
              })}
            </span>
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
