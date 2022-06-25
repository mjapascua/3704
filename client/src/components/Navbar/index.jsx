import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/requests";
import { logout } from "../../utils/authSlice";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
import { useCallback } from "react";
const routes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];

const min = 60;
const hr = 3600;

export const Navbar = React.memo(() => {
  const [notif, setNotifs] = useState({ data: [], unread: 0 });
  const [toggle, setToggle] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const wrapper = useRef(null);

  const authConfig = {
    headers: {
      Authorization: "Bearer " + user?.token,
    },
  };

  const displayNotif = (item) => {
    const date = new Date(item.created_at).getTime();
    const elapedSince = (Date.now() - date) / 1000;
    let text;

    switch (true) {
      case elapedSince < min:
        text = "Just now";
        break;
      case elapedSince >= min && elapedSince < 2 * min:
        text = "A minute ago";
        break;
      case elapedSince >= 2 * min && elapedSince < hr:
        text = Math.floor(elapedSince / 60) + " minutes ago";
        break;
      case elapedSince >= hr && elapedSince < 2 * hr:
        text = "An hour ago";
        break;
      case elapedSince >= 2 * hr && elapedSince < 24 * hr:
        text = Math.floor(elapedSince / hr) + " hours ago";
        break;
      case elapedSince >= 24 * hr && elapedSince < 48 * hr:
        text = "A day ago";
        break;
      case elapedSince >= 48 * hr && elapedSince <= 7 * 24 * hr:
        text = Math.floor(elapedSince / (24 * hr)) + " days ago";
        break;
      case elapedSince > 7 * 24 * hr:
        text = Math.floor(elapedSince / (24 * 7 * hr)) + " weeks ago";
        break;
      default:
        text = "";
        break;
    }

    return (
      <span
        key={item._id}
        className={
          "block w-80 pl-5 pr-7 cursor-pointer hover:bg-slate-100 " +
          (!item.read_status ? "bg-slate-200" : "bg-white")
        }
      >
        <span className="pt-2 block pb-3 border-b border-slate-200">
          <span className=" text-slate-800 font-semibold">{item.title}</span>
          <span className=" block text-slate-700 font-display">
            {item.text}
          </span>
          <span className=" text-slate-400 text-sm font-display">{text}</span>
        </span>
      </span>
    );
  };

  const fetchNotifs = useCallback(() => {
    if (user)
      apiClient
        .get("user/notifs", authConfig)
        .then((res) => {
          setNotifs((prev) => {
            return {
              ...prev,
              data: res.data.notifications,
              unread: res.data.unreadCount,
            };
          });
        })
        .catch(() => {
          dispatch(logout());
        });
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapper.current?.contains(e.target)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [wrapper]);
  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  return (
    <>
      <div className="md:px-7 px-4 py-3 sticky h-16 top-0 z-30 bg-white shadow-sm select-none items-center flex justify-between">
        <span
          onClick={() => {
            setMenu(!menu);
          }}
          className="material-icons-sharp md:hidden my-auto text-3xl"
        >
          menu
        </span>
        <span className="font-bold block text-md  md:text-xl my-1.5 text-center text-slate-800 md:pb-5">
          {process.env.REACT_APP_NAME}
        </span>
        <span className="flex items-center">
          <span className="w-fit mr-8 justify-center hidden md:inline-flex">
            {routes.map((route) => (
              <NavItem route={route} key={route.label} />
            ))}
          </span>

          {!user ? (
            <span className="">
              <Button
                onClick={() =>
                  navigate("/signup", {
                    replace: true,
                    state: { from: location },
                  })
                }
              >
                Join us
              </Button>
              <Button
                onClick={() =>
                  navigate("/login", {
                    replace: true,
                    state: { from: location },
                  })
                }
                className=" md:ml-1 text-white bg-cyan-600 transition-color"
              >
                Login
              </Button>
            </span>
          ) : (
            <div className="relative">
              <span className="relative  mr-5">
                <span
                  onClick={() => {
                    if (!toggle && notif.unread > 0) {
                      apiClient
                        .get("user/read_notifs", authConfig)
                        .then((res) => {
                          if (res.status === 200 && !res.data.message) {
                            setNotifs({
                              data: res.data.notifications,
                              unread: 0,
                            });
                          }
                        });
                    }
                    setToggle(true);
                  }}
                  className="material-icons-sharp text-gray-400 text-3xl cursor-pointer"
                >
                  notifications
                </span>
                {notif.unread > 0 && (
                  <span className=" w-3 h-3 left-5  bottom-6 inline-block absolute rounded-md bg-red-500"></span>
                )}
              </span>
              {toggle && (
                <div
                  ref={wrapper}
                  className="absolute rounded py-1 font-display right-0 md:right-14 border shadow-sprd bg-white"
                >
                  <span className="px-4 py-1 text-cyan-700 font-head font-semibold block">
                    NOTIFICATIONS
                  </span>
                  <div className="block overflow-y-scroll h-96">
                    {notif.data.map(displayNotif)}
                  </div>
                </div>
              )}
              <span
                onClick={() => navigate("/account")}
                className="material-icons-sharp text-cyan-600 text-4xl cursor-pointer"
              >
                account_circle
              </span>
            </div>
          )}
        </span>
      </div>

      <div className="fixed md:hidden bg-white w-full z-20">
        {menu && (
          <div>
            {routes.map((route) => (
              <span key={route.label} className="py-4 block border-b">
                <NavItem route={route} key={route.label} />
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
});
