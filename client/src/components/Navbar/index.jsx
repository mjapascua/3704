import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/requests";
import { logout } from "../../utils/authSlice";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
const routes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];

const min = 60;
const hr = 3600;

export const Navbar = React.memo(() => {
  const [notif, setNotifs] = useState({ show: false, data: [], unread: 0 });
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authConfig = {
    headers: {
      Authorization: "Bearer " + user?.token,
    },
  };

  const displayNotif = (item) => {
    const date = new Date(item.created_at).getTime();
    const elapedSince = (Date.now() - date) / 1000;
    let text;
    console.log(elapedSince);

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

  useEffect(() => {
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

  return (
    <div className="px-7 py-3 sticky h-16 top-0 z-30 bg-white shadow-sm select-none flex justify-between">
      <span className="material-icons-sharp md:hidden my-auto text-3xl">
        menu
      </span>
      <span className="my-auto px-4  font-bold">LOGO</span>
      <span className="flex items-center">
        <span className="w-fit mr-8 justify-center hidden md:inline-flex">
          {routes.map((route) => (
            <NavItem route={route} key={route.label} />
          ))}
        </span>

        {!user ? (
          <span>
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
                navigate("/login", { replace: true, state: { from: location } })
              }
              className=" ml-1 text-white bg-violet-600 transition-color"
            >
              Login
            </Button>
          </span>
        ) : (
          <div className="relative">
            <span className="relative  mr-5">
              <span
                onClick={() => {
                  if (!notif.show && notif.unread > 0) {
                    apiClient
                      .get("user/read_notifs", authConfig)
                      .then((res) => {
                        if (res.status === 200 && !res.data.message) {
                          setNotifs({
                            data: res.data.notifications,
                            unread: 0,
                            show: true,
                          });
                        }
                      });
                  }
                  setNotifs((prev) => {
                    return { ...prev, show: !prev.show };
                  });
                }}
                className="material-icons-sharp text-gray-400 text-3xl cursor-pointer"
              >
                notifications
              </span>
              {notif.unread > 0 && (
                <span className=" w-3 h-3 left-5  bottom-6 inline-block absolute rounded-md bg-red-500"></span>
              )}
            </span>

            {notif.show && (
              <div className="absolute rounded py-1 font-display right-14 border shadow-sprd bg-white">
                <span className="px-4 py-1 text-meadow-700 font-head font-semibold block">
                  NOTIFICATIONS
                </span>
                <div className="block overflow-scroll h-96">
                  {notif.data.map(displayNotif)}
                </div>
              </div>
            )}

            <span
              onClick={() => navigate("/account")}
              className="material-icons-sharp text-meadow-600 text-4xl cursor-pointer"
            >
              account_circle
            </span>
          </div>
        )}
      </span>
    </div>
  );
});
