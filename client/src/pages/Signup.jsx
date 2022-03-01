import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Buttons/Main";
import Loading from "../components/Loading/Loading";
import StatusMessage from "../components/StatusMessage";
import { reset } from "../utils/authSlice";
import { apiClient } from "../utils/requests";
import { redirect } from "./Login";
const emailUnavailableMessage = "Email is already taken";
export const phoneRegex = /^([0-9]{10})$/;
function SignUp() {
  const [credentials, setCredentials] = useState({
    email: "",
    first_name: "",
    last_name: "",
    residence: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });
  const [progress, setProgress] = useState(1);
  const [status, setStatus] = useState({
    active: false,
    text: "",
    status: null,
  });
  const [redir, setRedir] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const signUpBtn = useRef();

  let from = location.state?.from?.pathname || "/account";

  useEffect(() => {
    if (isError) {
      setStatus({
        active: true,
        text: message,
        status: 400,
      });
    }

    if (isSuccess || user) {
      redirect(setRedir, navigate, from);
    }
    dispatch(reset());
  }, [user, navigate, isError, message, dispatch]);

  const handleChange = ({ target }) => {
    setCredentials((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleSignUpRequest = (e) => {
    e.preventDefault();

    apiClient
      .post("users/", credentials)
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        }
      })
      .catch((err) => {
        setStatus({
          active: true,
          text: err.response.data.message,
          status: err.response.status,
        });
        if (err.response.data.message === emailUnavailableMessage) {
          setProgress(2);
        }
      });
  };

  const handlePasswordCheck = useCallback(() => {
    if (credentials.password && credentials.password.length < 8) {
      setStatus({
        active: true,
        text: "Password must be atleast 8 characters long",
        status: 400,
      });
    } else {
      setStatus((prev) => {
        return { ...prev, active: false };
      });
    }

    if (
      credentials.password &&
      credentials.password_confirm &&
      credentials.password !== credentials.password_confirm
    ) {
      setStatus({
        active: true,
        text: "Password does not match",
        status: 400,
      });
    }
    if (
      !credentials.password_confirm ||
      !credentials.password ||
      credentials.password !== credentials.password_confirm
    ) {
      signUpBtn.current.disabled = true;
    } else {
      setStatus({
        active: false,
        text: "",
        status: 200,
      });
      signUpBtn.current.disabled = false;
    }
  }, [credentials.password, credentials.password_confirm]);

  const handlePhoneNumberCheck = (
    phoneNumber,
    successCallback,
    errCallback
  ) => {
    if (!phoneRegex.test(phoneNumber) || !phoneNumber.startsWith("9")) {
      typeof successCallback === "function" && errCallback();
      return false;
    } else {
      typeof errCallback === "function" && successCallback();
      return true;
    }
  };

  useEffect(() => {
    if (progress === 3) handlePasswordCheck();
  }, [handlePasswordCheck, progress]);

  return (
    <main className="w-screen h-screen flex">
      {" "}
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
                className="px-2 lg:px-4 w-96 block  overflow-hidden "
              >
                <span className="my-auto text-lg text-meadow-600 block pb-3 font-bold">
                  Sign up
                </span>

                {progress === 1 && (
                  <div className=" animate-slideToR h-60 bg-white">
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
                    <label>
                      Residence
                      <span className="flex">
                        <input
                          type="text"
                          name="residence"
                          onChange={handleChange}
                          value={credentials.residence}
                          className="form-input"
                          placeholder="Enter your unit"
                          required
                        />
                      </span>
                    </label>
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
                            onChange={(e) => {
                              handleChange(e);
                              handlePhoneNumberCheck(
                                e.target.value,
                                () =>
                                  setStatus({
                                    active: false,
                                    text: "",
                                    status: 200,
                                  }),
                                () =>
                                  setStatus({
                                    active: true,
                                    text: "Invalid phone number",
                                    status: 400,
                                  })
                              );
                            }}
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
                        minLength="8"
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
                        minLength="8"
                        required
                      />
                    </label>
                    <Button type={"submit"} primary ref={signUpBtn}>
                      SIGN UP
                    </Button>
                  </div>
                )}
                <StatusMessage {...status} />
                <span className="w-full mt-1 inline-block h-6 select-none relative text-lg text-meadow-600">
                  {progress > 1 && (
                    <span
                      className="cursor-pointer absolute left-0 underline underline-offset-1"
                      onClick={() => {
                        setProgress(progress - 1);
                      }}
                    >
                      Back
                    </span>
                  )}
                  {progress === 1 &&
                    credentials.first_name &&
                    credentials.last_name &&
                    credentials.residence && (
                      <span
                        className="cursor-pointer absolute right-0 underline  underline-offset-1"
                        onClick={() => setProgress(progress + 1)}
                      >
                        Next
                      </span>
                    )}
                  {progress === 2 &&
                    credentials.email &&
                    handlePhoneNumberCheck(credentials.phone_number) && (
                      <span
                        className="cursor-pointer absolute right-0 underline  underline-offset-1"
                        onClick={() => setProgress(progress + 1)}
                      >
                        Next
                      </span>
                    )}
                  {}
                </span>
                <span className="block text-center border-b border-gray-300 py-3 mb-4 w-full">
                  {[1, 2, 3].map((num) => {
                    const defClass =
                      (progress === num ? " w-7" : " w-2.5") +
                      " transition-all mr-2 rounded-xl inline-block h-2.5 bg-gray-300";

                    return (
                      <span
                        key={num}
                        className={
                          (progress >= num
                            ? " bg-meadow-500"
                            : " bg-gray-300") + defClass
                        }
                      ></span>
                    );
                  })}
                </span>
                <span className="w-fit block mx-auto mb-4">
                  Already a member?
                </span>
                <Button
                  secondary
                  onClick={() => navigate("/login", { replace: true })}
                >
                  LOG IN
                </Button>
              </form>
            </div>
          </div>
          <div className="w-1/2  bg-meadow-700  inline-block"></div>
        </>
      )}
    </main>
  );
}

export default SignUp;
