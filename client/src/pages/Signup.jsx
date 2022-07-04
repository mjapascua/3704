import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { ReturnButton } from "../components/Buttons/Return";
import Loading from "../components/Loading/Loading";
import StatusMessage from "../components/StatusMessage";
import authService from "../utils/authService";
import { reset } from "../utils/authSlice";
import Swal from "sweetalert2";
import { apiClient } from "../utils/requests";
import { redirect } from "./Login";
import { toast } from "react-toastify";
import { CLIENT_NAME } from "../utils/appInfo";
export const phoneRegex = /^([0-9]{10})$/;

function SignUp() {
  const [credentials, setCredentials] = useState({
    email: "",
    fname: "",
    lname: "",
    residence: "",
    contact: "",
  });
  const [progress, setProgress] = useState(1);
  const [status, setStatus] = useState({
    text: "",
    status: null,
  });
  const [redir, setRedir] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  let from = location.state?.from?.pathname
    ? location.state?.from?.pathname
    : user?.role === authService.ROLES.ADMIN ||
      user?.role === authService.ROLES.EDITOR
    ? "/dashboard/qr-scanner"
    : "/account";

  useEffect(() => {
    if (isError) {
      setStatus({
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
      .post("user/", credentials)
      .then((res) => {
        if (res.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Your account is being verified please wait for confirmation via email",
            confirmButtonText: "Back to home page",
            allowOutsideClick: false,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) {
              navigate("/", { replace: true });
            }
          });
        }
      })
      .catch((err) => {
        const text = err.response.data.message;
        setStatus({
          text: text,
          status: 400,
        });
        if (text.includes("Email"))
          toast.error("Please use a different email", {
            position: toast.POSITION.BOTTOM_LEFT,
          });
      });
  };

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
            text-sm
            text-gray-800
            "
          >
            <span
              className="text
              w-full border-b pb-5 border-gray-300 mb-5"
            >
              <ReturnButton />
              <span className="my-auto w-full text-lg text-center block font-bold">
                {CLIENT_NAME}
              </span>
            </span>

            <div className="flex justify-center font-display">
              <form
                onSubmit={handleSignUpRequest}
                className="px-2 lg:px-4 w-96 block  overflow-hidden "
              >
                <span className="my-auto text-lg text-teal-600 block font-bold">
                  Sign up
                </span>
                <span className="text-md block pb-4 pt-1">
                  Please fill up information and we will come back to you.
                </span>
                {progress === 1 && (
                  <div className=" animate-slideToR h-60 bg-white">
                    <label>
                      First Name
                      <input
                        type="text"
                        name="fname"
                        onChange={handleChange}
                        value={credentials.fname}
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
                          name="lname"
                          onChange={handleChange}
                          value={credentials.lname}
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
                            name="contact"
                            onChange={(e) => {
                              handleChange(e);
                              handlePhoneNumberCheck(
                                e.target.value,
                                () =>
                                  setStatus({
                                    text: "",
                                    status: 200,
                                  }),
                                () =>
                                  setStatus({
                                    text: "Invalid phone number",
                                    status: 400,
                                  })
                              );
                            }}
                            value={credentials.contact}
                            className="form-input !inline-block"
                            placeholder="9*********"
                            required
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                <Button
                  type={"submit"}
                  primary
                  disabled={
                    !handlePhoneNumberCheck(credentials.contact) ||
                    !credentials.email ||
                    !credentials.fname ||
                    !credentials.lname ||
                    !credentials.residence
                  }
                  className="w-full"
                >
                  SIGN UP
                </Button>
                <StatusMessage {...status} />
                <span className="w-full mt-3 inline-block h-6 select-none relative text-lg text-teal-600">
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
                    credentials.fname &&
                    credentials.lname &&
                    credentials.residence && (
                      <span
                        className="cursor-pointer absolute right-0 underline  underline-offset-1"
                        onClick={() => setProgress(progress + 1)}
                      >
                        Next
                      </span>
                    )}
                </span>
                <span className="block text-center border-b border-gray-300 py-3 mb-4 w-full">
                  {[1, 2, 3].map((num) => {
                    const defClass =
                      (progress === num ? " w-7" : " w-2.5") +
                      " transition-all mr-2 rounded-xl inline-block transition-all ease-in h-2.5 bg-gray-300";

                    return (
                      <span
                        key={num}
                        className={
                          (progress >= num ? " bg-teal-500" : " bg-gray-300") +
                          defClass
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
                  className="w-full mb-20 md:mb-0"
                  onClick={() => navigate("/login", { replace: true })}
                >
                  LOG IN
                </Button>
              </form>
            </div>
          </div>
          <div className="w-1/2 hidden bg-teal-600  md:inline-block"></div>
        </>
      )}
    </main>
  );
}

export default SignUp;
