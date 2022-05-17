import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Buttons/Main";
import Loading from "../components/Loading/Loading";
import authService from "../utils/authService";
import { logout, reset } from "../utils/authSlice";
import { apiClient } from "../utils/requests";
import EventsCalendar from "./User/EventsCalendar";
import QRFormPage from "./User/QRFormPage";
import swal from "sweetalert2";
import { swalCustomClass } from "../utils/general";
import { redirect } from "./Login";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redir, setRedir] = useState(false);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      redirect(setRedir, navigate, "/login");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const authConfig = {
    headers: {
      Authorization: "Bearer " + user?.token,
    },
  };

  useEffect(() => {
    document.title = "Account | " + process.env.REACT_APP_NAME;
  }, []);

  return (
    <>
      {redir ? (
        <div className="w-full h-screen">
          <Loading text={"Unauthorized, redirecting"} />
        </div>
      ) : (
        <div className="flex h-full">
          <span className=" w-80 block p-4 h-64 md:h-full border-r">
            <Button
              primary
              onClick={() => navigate("/account")}
              className="w-full"
            >
              My account
              <span className="material-icons-sharp text-3xl">
                manage_accounts
              </span>
            </Button>
            <Button
              primary
              onClick={() => navigate("generate-qr-pass")}
              className="w-full"
            >
              Create visitor pass
              <span className="material-icons-sharp text-3xl">qr_code</span>
            </Button>

            {/*  <Button primary classes={"mb-5"}>
            Dues
            <span className="material-icons-sharp text-3xl">payment</span>
          </Button>
          <Button primary classes={"mb-5"}>
            Message
            <span className="material-icons-sharp text-3xl">forum</span>
          </Button> */}
            <Button
              primary
              onClick={() => navigate("calendar")}
              className="w-full"
            >
              Calendar
              <span className="material-icons-sharp text-3xl">
                calendar_month
              </span>
            </Button>
            {user?.role === authService.ROLES.ADMIN && (
              <Button
                primary
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Admin dashboard
                <span className="material-icons-sharp text-3xl">
                  admin_panel_settings
                </span>
              </Button>
            )}
            <Button
              primary
              onClick={() => {
                dispatch(logout());
                navigate("/", { replace: true });
              }}
              className="w-full"
            >
              Logout
              <span className="material-icons-sharp text-3xl">logout</span>
            </Button>
          </span>
          <div className="bg-white w-full px-10 py-5">
            <Routes>
              <Route
                path="/"
                element={<UserAccount authConfig={authConfig} />}
              />
              <Route
                path="/generate-qr-pass"
                element={<QRFormPage authConfig={authConfig} />}
              />
              <Route
                path="/calendar"
                element={<EventsCalendar authConfig={authConfig} />}
              />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
};

const defUserState = {
  id: null,
  fname: null,
  lname: null,
  email: null,
  contact: null,
  residence: null,
  guests: [],
};
const UserAccount = ({ authConfig }) => {
  const [userData, setUserData] = useState(defUserState);
  const [qr, setQr] = useState(null);

  const { id, fname, lname, email, contact, residence, guests } = userData;

  const [edit, setEdit] = useState(false);
  const [item, setItem] = useState(null);

  const reqUserInfo = useCallback(() => {
    apiClient.get("user/me", authConfig).then((res) => {
      setUserData(res.data);
    });
  }, []);
  const removeGuest = ({ gId, name }) => {
    swal
      .fire({
        text: `Are you sure you want to remove ${name} as a guest?`,
        confirmButtonColor: "var(--toastify-color-success)",
        cancelButtonColor: "var(--toastify-color-error)",
        showCancelButton: true,
        confirmButtonText: "Confirm",
        customClass: swalCustomClass,
        icon: "warning",
      })
      .then((result) => {
        if (result.isConfirmed)
          apiClient
            .delete("/user/" + id + "/" + gId, authConfig)
            .then(() => reqUserInfo());
      });
  };

  useEffect(() => {
    reqUserInfo();
  }, [reqUserInfo]);

  const handleChange = ({ target }) => {
    setItem((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    apiClient
      .put(`user/${id}`, item, authConfig)
      .then((res) => {
        if (res.status === 200 && !res.data.message) {
          reqUserInfo();
          setEdit(false);
          setItem(null);
          toast.info(`Account information has been updated`);
        }
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };

  const requestUserQR = () => {
    apiClient
      .get("user/qr", authConfig)
      .then((res) => {
        if (res.status === 200 && !res.data.message) {
          setQr({ url: res.data });
        } else toast.error(res.response.message);
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };
  const requestGuestQR = (id) => {
    apiClient
      .get("user/guest_qr/" + id, authConfig)
      .then((res) => {
        if (res.status === 200 && !res.data.message) {
          setQr({ url: res.data });
        } else toast.error(res.response.message);
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };

  return (
    <div>
      {!userData.id ? (
        <Loading />
      ) : (
        <>
          <Button onClick={requestUserQR}>Show my QR code</Button>
          {qr?.url && <img src={qr.url} className="w-64 mb-4" />}
          <span
            onClick={() => {
              setEdit((prev) => !prev);
              setItem({
                fname,
                lname,
                email,
                contact,
                residence,
              });
            }}
            className="material-icons-sharp text-gray-400 cursor-pointer"
          >
            edit
          </span>
          {userData && !edit && (
            <div>
              <div>
                <span className="block ">
                  <b>First name:</b>
                  {fname}
                </span>
                <span className="block ">
                  <b>Last name:</b>
                  {lname}
                </span>
                <span className="block ">
                  <b>Phone number:</b>
                  {contact}
                </span>
                <span className="block ">
                  <b>Address:</b>
                  {residence}
                </span>
                {guests.length > 0 && (
                  <>
                    <span className="block ">
                      <b>Guests:</b>
                    </span>

                    <span className=" block overflow-auto">
                      {guests.map((el, index) => {
                        return (
                          <span key={index} className="block ">
                            {el.fname + " " + el.lname}
                            <Button onClick={() => requestGuestQR(el.qr)}>
                              show qr
                            </Button>
                            <Button
                              onClick={() =>
                                removeGuest({
                                  gId: el._id,
                                  name: el.fname,
                                })
                              }
                            >
                              remove
                            </Button>
                          </span>
                        );
                      })}
                    </span>
                  </>
                )}
                {/*                 {user_tags.length > 0 && (
                  <>
                    <span className="block ">
                      <b>Your Cards:</b>
                    </span>
                    <span className="h-80 block overflow-auto">
                      {user_tags.map((el, index) => {
                        return (
                          <span key={index} className="block ">
                            {el.used_by}
                          </span>
                        );
                      })}
                    </span>
                  </>
                )} */}
              </div>
            </div>
          )}
          {edit && item && (
            <form className="w-full py-1" onSubmit={handleSubmitEdit}>
              <span className="inline-flex w-3/4 justify-between ">
                <label>
                  <input
                    type="text"
                    value={item.fname}
                    name="fname"
                    className="form-input !w-40"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <input
                    type="text"
                    value={item.lname}
                    name="lname"
                    className="form-input !w-40"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>
                    <span className="px-1 mr-2 py-4 text-base inline-block">
                      <>+63</>
                    </span>
                    <input
                      type="text"
                      name="contact"
                      onChange={handleChange}
                      value={item.contact}
                      className="form-input !inline-block !w-40"
                      placeholder="9*********"
                      required
                    />
                  </span>
                </label>
                <label>
                  <input
                    type="email"
                    value={item.email}
                    name="email"
                    className="form-input !w-56"
                    onChange={handleChange}
                  />
                </label>
              </span>

              <Button className="w-40" type={"submit"}>
                Save
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
};
export default Account;
/* Object.keys(userData).map((key) => {
          if (userData[key] instanceof Array) {
            return (
              <span key={key}>
                <span className="block ">
                  <b>{"Guests : "}</b>
                </span>
                <span className="h-80 block overflow-auto">
                  {userData[key].map((el, index) => {
                    return (
                      <span key={index} className="block ">
                        {el.fname + " " + el.lname}
                        <Button onClick={() => removeGuest(el._id)}>
                          remove
                        </Button>
                      </span>
                    );
                  })}
                </span>
              </span>
            );
          } else
            return (
              <span key={key} className="block ">
                <b className="capitalize">{key.split("_").join(" ") + ": "}</b>
                {userData[key]}
              </span>
            );
        }) */
