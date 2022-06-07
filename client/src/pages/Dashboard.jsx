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
import ManageDevices from "./Admin/ManageDevices";
import ManageScanLogs from "./Admin/ManageScanLogs";
import AccountPage from "./Admin/AccountPage";

const navStyle =
  "w-full flex items-center font-display cursor-pointer md:rounded-tl-md md:rounded-bl-md justify-center md:justify-start mb-3 px-8";
const activeStyle = "text-slate-50 bg-violet-700 py-7 " + navStyle;
const defStyle = "text-gray-500 text-sm py-5 " + navStyle;
const sideMenuStyle =
  "bg-neutral-900 z-30 left-0 w-max box-border block h-screen md:pl-5";

const routes = [
  { to: "/dashboard", label: "Dashboard", icon: "home", end: true },
  { to: "/dashboard/bulletin", label: "Bulletin", icon: "feed" },
  { to: "/dashboard/qr-scanner", label: "QR Scanner", icon: "qr_code_scanner" },
  { to: "/dashboard/scan-logs", label: "Scan Records", icon: "history" },
  { to: "/dashboard/accounts", label: "Accounts", icon: "manage_accounts" },
  {
    to: "/dashboard/rfid-devices",
    label: "Locations & Devices",
    icon: "sensors",
  },
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

  useEffect(() => {
    if (
      user &&
      user?.role !== authService.ROLES.ADMIN &&
      user?.role !== authService.ROLES.EDITOR
    ) {
      redirect(setRedir, navigate, "/");
    }
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
      })?.label || ""
    );
  };

  useEffect(() => {
    setHeader();
  }, [location]);

  useEffect(() => {
    document.title = "Admin dashboard | " + process.env.REACT_APP_NAME;
  }, []);

  return (
    <>
      {redir ? (
        <div className="w-full h-screen">
          <Loading text={"Unauthorized, redirecting"} />
        </div>
      ) : (
        <>
          <DashboardNav
            handleMenuClick={handleMenuClick}
            pageLabel={pageLabel}
            open={open}
          />
          <div className="pt-14 z-40 fixed">
            <Sidemenu style={style} handleMenuClick={handleMenuClick} />
          </div>

          <div className="absolute">
            <div className="pt-14 relative w-full flex h-screen box-border">
              <div
                className="w-full flex overflow-scroll"
                onClick={() => open && handleMenuClick()}
              >
                {open && (
                  <div className="w-full flex h-screen fixed z-30 bg-slate-700 opacity-50 "></div>
                )}
                <Routes>
                  <Route
                    path={"/accounts/:id"}
                    element={<AccountPage authConfig={authConfig} />}
                  />
                  <Route
                    path={"/accounts"}
                    element={<ManageAccounts authConfig={authConfig} />}
                  />
                  <Route
                    path={"/bulletin"}
                    element={<ManageBulletin authConfig={authConfig} />}
                  />
                  <Route
                    path={"/qr-scanner"}
                    element={<AdminScanner authConfig={authConfig} />}
                  />
                  <Route
                    path={"/scan-logs"}
                    element={<ManageScanLogs authConfig={authConfig} />}
                  />
                  <Route
                    path={"/rfid-devices"}
                    element={<ManageDevices authConfig={authConfig} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const DashboardNav = ({ handleMenuClick, pageLabel, open }) => {
  return (
    <div className=" bg-neutral-900 z-50 absolute flex select-none top-0 h-14 w-full text-gray-50">
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

export const Sidemenu = ({ style, handleMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={style}>
      {routes.map((route) => {
        return (
          <NavLink
            end={route.end || false}
            key={route.to}
            to={route.to}
            className={({ isActive }) => (isActive ? activeStyle : defStyle)}
            onClick={handleMenuClick}
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
      <span
        onClick={() => {
          navigate("/account", { replace: true });
        }}
        className={defStyle}
      >
        <span className="material-icons-sharp md:mr-5">face</span>
        <span className="md:w-max md:block font-semibold hidden">
          User page
        </span>
      </span>
      <span
        onClick={() => {
          dispatch(logout());
          navigate("/", { replace: true });
        }}
        className={defStyle}
      >
        <span className="material-icons-sharp md:mr-5">logout</span>
        <span className="md:w-max md:block font-semibold hidden">Logout</span>
      </span>
    </div>
  );
};
export default Dashboard;
