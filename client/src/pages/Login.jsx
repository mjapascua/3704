import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../components/Buttons/Main";
import { toast } from "react-toastify";
import { login, reset } from "../utils/authSlice";
import Loading from "../components/Loading/Loading";
import { ReturnButton } from "../components/Buttons/Return";
import authService from "../utils/authService";

export const redirect = (renderLoading, navigate, from) => {
  renderLoading(true);
  setTimeout(() => {
    navigate(from, { replace: true });
  }, 1000);
};

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [viewPass, setViewPass] = useState(false);
  const [redir, setRedir] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  let from = location.state?.from?.pathname
    ? location.state?.from?.pathname
    : user?.role === authService.ROLES.ADMIN
    ? "/dashboard/qr-scanner"
    : "/account";

  useEffect(() => {
    if (isError) {
      toast.error(message, { position: toast.POSITION.BOTTOM_LEFT });
    }
    if (user) {
      redirect(setRedir, navigate, from);
    }
    dispatch(reset());
  }, [user, navigate, isError, message, dispatch]);

  const handleChange = ({ target }) => {
    setCredentials((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleLoginRequest = (e) => {
    e.preventDefault();
    dispatch(login(credentials))
      .unwrap()
      .then((res) => {
        if (res.role === authService.ROLES.ADMIN) {
          redirect(setRedir, navigate, "/dashboard/qr-scanner");
        } else redirect(setRedir, navigate, "/account");
      });
  };
  useEffect(() => {
    document.title = "Login or Sign up";
  }, []);
  return (
    <main className="w-screen h-screen flex">
      {redir ? (
        <div className="w-full">
          <Loading text={"Authenticated, now redirecting"} />
        </div>
      ) : (
        <>
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
              <ReturnButton />
              <span className="my-auto w-full text-lg text-center block font-bold">
                {process.env.REACT_APP_NAME}
              </span>
            </span>
            <div className="flex justify-center  font-display">
              {isLoading ? (
                <Loading />
              ) : (
                <form
                  onSubmit={handleLoginRequest}
                  className="px-2 lg:px-4 w-96"
                >
                  <span className="my-auto text-lg text-teal-600 block pb-6 font-bold">
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
                      onClick={() => setViewPass((prev) => !prev)}
                      className="material-icons-sharp absolute cursor-pointer right-0 text-base px-1"
                    >
                      {!viewPass ? "visibility_off" : "visibility"}
                    </span>
                    <input
                      type={!viewPass ? "password" : "text"}
                      autoComplete="current-password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      className="form-input"
                      required
                      placeholder="Enter password"
                    />
                  </div>
                  <span className="mb-2 inline-flex justify-between w-full">
                    <label className="flex items-center mb-5 ">
                      Remember me
                      <input
                        name="remember"
                        value={credentials.remember}
                        onChange={(e) =>
                          setCredentials((prev) => {
                            return { ...prev, remember: e.target.checked };
                          })
                        }
                        type="checkbox"
                        className="ml-2"
                      />
                    </label>
                    <span className="underline font-semibold text-teal-600">
                      <a href="#">Forgot Password?</a>
                    </span>
                  </span>
                  <Button
                    disabled={!(credentials.email && credentials.password)}
                    type={"submit"}
                    className="w-full"
                    primary
                  >
                    LOGIN
                  </Button>
                  <span className="border-b border-gray-300 mb-4 block w-full"></span>
                  <span className="w-fit block mx-auto mb-4">
                    Not a member?
                  </span>
                  <Button
                    secondary
                    className="w-full"
                    onClick={() => navigate("/signup", { replace: true })}
                  >
                    SIGN UP
                  </Button>
                </form>
              )}
            </div>
          </div>
          <div className="w-1/2  bg-teal-600  inline-block"></div>
        </>
      )}
    </main>
  );
}

export default Login;
