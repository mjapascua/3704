import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/Buttons/Main";
import Loading from "../components/Loading/Loading";
import authService from "../utils/authService";
import { logout, reset } from "../utils/authSlice";
import { apiClient } from "../utils/requests";
import QRFormPage from "./User/QRFormPage";
import swal from "sweetalert2";
import { swalCustomClass } from "../utils/general";
import { redirect } from "./Login";
import { navStyle } from "./Dashboard";
import RenderQRCode from "./User/RenderQRCode";
import { CLIENT_NAME } from "../utils/appInfo";
const activeStyle =
  "border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:border-cyan-700 " +
  navStyle;
const defStyle =
  "text-gray-500 border-slate-50 hover:bg-cyan-600 hover:border-cyan-700 " +
  navStyle;
const routes = [
  { to: "/account", label: "My account", icon: "manage_accounts", end: true },
  {
    to: "/account/generate-qr-pass",
    label: "Create visitor pass",
    icon: "qr_code",
  },
];

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redir, setRedir] = useState(false);
  const { user, isError, message } = useSelector((state) => state.auth);

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
    document.title = "Account | " + CLIENT_NAME;
  }, []);

  return (
    <>
      {redir ? (
        <div className="w-full h-screen">
          <Loading text={"Unauthorized, redirecting"} />
        </div>
      ) : (
        <div className="flex h-full relative">
          <span className=" w-16 md:w-80 md:pl-3 block bg-slate-50 h-full">
            {routes.map((route) => {
              return (
                <NavLink
                  end={route.end || false}
                  key={route.to}
                  to={route.to}
                  className={({ isActive }) =>
                    isActive ? activeStyle : defStyle
                  }
                >
                  <span className="material-icons-sharp md:mr-5 inline-block">
                    {route.icon}
                  </span>
                  <span className="md:w-max h-fit font-semibold md:block hidden">
                    {route.label}
                  </span>
                </NavLink>
              );
            })}

            {user?.role === authService.ROLES.ADMIN && (
              <NavLink
                to={"/dashboard/qr-scanner"}
                className={({ isActive }) =>
                  isActive ? activeStyle : defStyle
                }
              >
                <span className="material-icons-sharp md:mr-5 inline-block">
                  admin_panel_settings
                </span>
                <span className="md:w-max h-fit font-semibold md:block hidden">
                  Admin dashboard
                </span>
              </NavLink>
            )}
            <span
              onClick={() => {
                dispatch(logout());
                navigate("/", { replace: true });
              }}
              className={defStyle}
            >
              <span className="material-icons-sharp md:mr-5">logout</span>
              <span className="md:w-max md:block font-semibold hidden">
                Logout
              </span>
            </span>
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
  const [modal, setModal] = useState(false);

  const { id, fname, lname, email, contact, residence, guests, tags } =
    userData;

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
        toast.error("Failed to update");
      });
  };

  const requestUserQR = () => {
    apiClient
      .get("user/qr", authConfig)
      .then((res) => {
        if (res.status === 200 && !res.data.message) {
          setQr({ url: res.data, name: fname + " " + lname, resident: true });
          setModal(true);
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
          setQr({ url: res.data.url, name: res.data.name });
          setModal(true);
        } else toast.error(res.response.message);
      })
      .catch((error) => {
        toast.error(error.response.message);
      });
  };

  return (
    <>
      {!userData.id ? (
        <Loading />
      ) : (
        <>
          {modal && (
            <div
              onClick={() => setModal(!modal)}
              className=" bg-slate-900 bg-opacity-30 z-40 pb-10 flex justify-center items-center fixed w-screen h-screen left-0 top-0"
            >
              <RenderQRCode
                name={qr.name}
                url={qr.url}
                resident={qr.resident}
              />
            </div>
          )}
          {userData && !edit && (
            <div>
              <div>
                <span className="text-cyan-600 font-semibold">Welcome</span>
                <span className="block mb-6 text-2xl">
                  <b>{fname + " " + lname}</b>
                  <Button
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
                  >
                    <span className="material-icons-sharp text-base ">
                      edit
                    </span>
                  </Button>
                </span>
                <Button primary onClick={requestUserQR}>
                  Show my QR code
                </Button>
                {guests.length > 0 && (
                  <>
                    <span className="block mb-3">
                      <b>My guests</b>
                    </span>

                    <span className=" block overflow-auto">
                      {guests.map((el, index) => {
                        return (
                          <span
                            key={index}
                            className="flex items-center w-3/5 h-14 justify-between my-2 rounded bg-white shadow border px-3 py-2 "
                          >
                            {el.fname + " " + el.lname}
                            <span>
                              <Button onClick={() => requestGuestQR(el.qr)}>
                                show qr
                              </Button>
                              <Button
                                className="text-rose-500 hover:underline"
                                onClick={() =>
                                  removeGuest({
                                    gId: el._id,
                                    name: el.fname,
                                  })
                                }
                              >
                                REMOVE
                              </Button>
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </>
                )}
                {tags.length > 0 && (
                  <>
                    <span className="block mt-6 mb-3">
                      <b>RFIDs under me</b>
                    </span>
                    <span className="h-80 block overflow-auto">
                      {tags.map((el, index) => {
                        return (
                          <span
                            key={index}
                            className="flex items-center w-3/5 h-14 justify-between my-2 rounded bg-white shadow border px-3 py-3"
                          >
                            {el.g_id?.fname || fname + " " + lname}
                          </span>
                        );
                      })}
                    </span>
                  </>
                )}
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
              <br />
              <Button
                className="w-56 bg-rose-500 mr-4 text-slate-50"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
              <Button primary className="w-56" type={"submit"}>
                Save
              </Button>
            </form>
          )}
        </>
      )}
    </>
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
