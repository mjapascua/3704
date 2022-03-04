import React, { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ManageAccounts from "./Admin/ManageAccounts";
import ManageBulletin from "./Admin/ManageBulletin";
import AdminScanner from "./Admin/AdminScanner";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../utils/authSlice";
import { redirect } from "./Login";
import Loading from "../components/Loading/Loading";
import authService from "../utils/authService";

const navStyle =
  "w-full flex text-sm items-center cursor-pointer  md:rounded-tl-md md:rounded-bl-md justify-center md:justify-start mb-4 py-5 px-8";
const activeStyle = "text-slate-50 bg-meadow-700 " + navStyle;
const defStyle = "text-gray-500 " + navStyle;
const sideMenuStyle =
  "bg-neutral-900 z-20 left-0 w-max h-full box-border  md:pl-5";

const routes = [
  { to: "/dashboard", label: "Dashboard", icon: "home" },
  { to: "/dashboard/bulletin", label: "Manage bulletin", icon: "feed" },
  { to: "/dashboard/qr-scanner", label: "QR Scanner", icon: "qr_code_scanner" },
  { to: "/dashboard/accounts", label: "Accounts", icon: "manage_accounts" },
];

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState("hidden " + sideMenuStyle);
  const [pageLabel, setLabel] = useState(false);
  const [redir, setRedir] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const authConfig = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  useEffect(() => {
    if (
      user.role !== authService.ROLES.ADMIN &&
      user.role !== authService.ROLES.EDITOR
    ) {
      redirect(setRedir, navigate, "/");
    }
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const handleMenuClick = () => {
    if (open) {
      setOpen(false);
      setStyle("animate-slideToL " + sideMenuStyle);
      setTimeout(() => {
        setStyle("hidden " + sideMenuStyle);
      }, 200);
    } else {
      setOpen(true);
      setStyle("animate-slideToR " + sideMenuStyle);
    }
  };

  const setHeader = () => {
    setLabel(
      routes.find((route) => {
        return route.to === location.pathname;
      }).label
    );
  };

  useEffect(() => {
    setHeader();
  }, [location]);

  useEffect(() => {
    document.title = "Admin dashboard";
  }, []);

  return (
    <>
      {redir ? (
        <div className="w-full h-screen">
          <Loading text={"Unauthorized, redirecting"} />
        </div>
      ) : (
        <div className=" font-display">
          <DashboardNav
            handleMenuClick={handleMenuClick}
            pageLabel={pageLabel}
            open={open}
          />

          <div className="pt-14 relative w-full flex h-screen box-border">
            <Sidemenu style={style} />
            <div className="w-full flex overflow-scroll">
              <Routes>
                <Route path={"/accounts"} element={<ManageAccounts />} />
                <Route path={"/bulletin"} element={<ManageBulletin />} />
                <Route
                  path={"/qr-scanner"}
                  element={<AdminScanner authConfig={authConfig} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const DashboardNav = ({ handleMenuClick, pageLabel, open }) => {
  return (
    <div className=" bg-neutral-900 z-10 absolute flex select-none top-0 h-14 w-full text-gray-50">
      {!open ? (
        <span
          onClick={handleMenuClick}
          className="material-icons-sharp w-14 cursor-pointer text-center my-auto text-3xl"
        >
          menu
        </span>
      ) : (
        <span
          onClick={handleMenuClick}
          className={
            "material-icons-sharp cursor-pointer text-gray-50 w-14 px-5 block my-auto text-left"
          }
        >
          arrow_back
        </span>
      )}
      <span className="text-center my-auto">
        <b>{pageLabel}</b>
      </span>
    </div>
  );
};

export const Sidemenu = ({ style }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={style}>
      {routes.map((route) => {
        return (
          <NavLink
            end
            key={route.to}
            to={route.to}
            className={({ isActive }) => (isActive ? activeStyle : defStyle)}
          >
            <span className="material-icons-sharp md:mr-5 inline-block">
              {route.icon}
            </span>
            <b className="md:w-max h-fit md:block hidden">{route.label}</b>
          </NavLink>
        );
      })}
      <span
        onClick={() => {
          navigate("/account", { replace: true });
        }}
        className={defStyle}
      >
        <span className="material-icons-sharp md:mr-5">logout</span>
        <b className="md:w-max md:block hidden">Logout</b>
      </span>
      <span
        onClick={() => {
          navigate("/account", { replace: true });
        }}
        className={defStyle}
      >
        <span className="material-icons-sharp md:mr-5">face</span>
        <b className="md:w-max md:block hidden">User page</b>
      </span>
    </div>
  );
};
export default Dashboard;
