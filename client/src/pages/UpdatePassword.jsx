import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Buttons/Main";
import Loading from "../components/Loading/Loading";
import StatusMessage from "../components/StatusMessage";
import authService from "../utils/authService";
import { login, reset } from "../utils/authSlice";
import { apiClient } from "../utils/requests";
import { redirect } from "./Login";

export const phoneRegex = /^([0-9]{10})$/;

function UpdatePassword() {
  const id = useParams().id;
  const uniq = useParams().uniq;
  const [credentials, setCredentials] = useState({
    id: id,
    fname: "",
    password: "",
    password_confirm: "",
  });

  const [viewPass, setViewPass] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);

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
  const signUpBtn = useRef();

  let from = location.state?.from?.pathname
    ? location.state?.from?.pathname
    : user?.role === authService.ROLES.ADMIN
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

  const fetchInfo = useCallback(() => {
    apiClient.get("user/newpass/" + uniq + "/" + credentials.id).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        setCredentials((prev) => {
          return { ...prev, fname: res.data.fname, email: res.data.email };
        });
      }
    });
  }, []);

  const sendNewPass = (e) => {
    e.preventDefault();
    apiClient
      .put("user/newpass/" + uniq + "/" + credentials.id, {
        password: credentials.password,
      })
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            handleSignUpRequest();
          }, 1000);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleSignUpRequest = () => {
    dispatch(login({ ...credentials }))
      .unwrap()
      .catch((errMess) => {
        setStatus({
          text: errMess,
          status: 400,
        });
      });
  };

  const handlePasswordCheck = useCallback(() => {
    if (credentials.password && credentials.password.length < 8) {
      setStatus({
        text: "Password must be atleast 8 characters long",
        status: 400,
      });
    } else {
      setStatus({ text: "" });
    }

    if (
      credentials.password &&
      credentials.password_confirm &&
      credentials.password !== credentials.password_confirm
    ) {
      setStatus({
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
        text: "",
        status: 200,
      });
      signUpBtn.current.disabled = false;
    }
  }, [credentials.password, credentials.password_confirm]);

  useEffect(() => {
    handlePasswordCheck();
  }, [handlePasswordCheck]);

  useEffect(() => {
    document.title = "Change password";
    fetchInfo();
  }, [fetchInfo]);

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
            <div className="flex justify-center font-display">
              <form
                onSubmit={sendNewPass}
                className="px-2 lg:px-4 w-96 block  overflow-hidden "
              >
                <span className="my-auto text-lg text-violet-600 block font-bold">
                  Change password
                </span>
                <span className="text-md block pb-4 pt-1">
                  Hi <b>{credentials.fname}!</b> you can now save to change your
                  password
                </span>

                <div className=" animate-slideToR h-60 bg-white">
                  <label className="md:mr-1 md:w-44 relative">
                    Password
                    <span
                      onClick={() => setViewPass((prev) => !prev)}
                      className="material-icons-sharp absolute cursor-pointer right-0 text-base px-1"
                    >
                      {!viewPass ? "visibility_off" : "visibility"}
                    </span>
                    <input
                      type={!viewPass ? "password" : "text"}
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

                  <label className="md:ml-1 md:w-44 relative">
                    Confirm password
                    <span
                      onClick={() => setViewPass2((prev) => !prev)}
                      className="material-icons-sharp absolute cursor-pointer right-0 text-base px-1"
                    >
                      {!viewPass2 ? "visibility_off" : "visibility"}
                    </span>
                    <input
                      type={!viewPass2 ? "password" : "text"}
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
                  <Button
                    type={"submit"}
                    primary
                    ref={signUpBtn}
                    className="w-full"
                  >
                    FINISH
                  </Button>
                </div>
                <StatusMessage {...status} />
              </form>
            </div>
          </div>
          <div className="w-1/2  bg-meadow-700  inline-block"></div>
        </>
      )}
    </main>
  );
}

export default UpdatePassword;
