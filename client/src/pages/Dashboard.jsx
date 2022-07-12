import React, { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../utils/authSlice";
import { redirect } from "./Login";
import Loading from "../components/Loading/Loading";
import authService from "../utils/authService";
import { CLIENT_NAME } from "../utils/appInfo";
import Analytics from "./Admin/Analytics";

const ManageAccounts = React.lazy(() => import("./Admin/ManageAccounts"));
const ManageDevices = React.lazy(() => import("./Admin/ManageDevices"));
const ManageBulletin = React.lazy(() => import("./Admin/ManageBulletin"));
const ManageScanLogs = React.lazy(() => import("./Admin/ManageScanLogs"));
const AdminScanner = React.lazy(() => import("./Admin/AdminScanner"));
const AccountPage = React.lazy(() => import("./Admin/AccountPage"));
export const navStyle =
  "w-full flex items-center font-display py-4 text-sm cursor-pointer border-r-4 transition-all hover:text-white justify-center md:justify-start my-5 px-6";
const activeStyle =
  "border-sky-600 text-sky-600 hover:bg-sky-600 hover:border-sky-700 " +
  navStyle;
const defStyle =
  "text-gray-500 border-slate-50 hover:bg-sky-600 hover:border-sky-700 " +
  navStyle;
const sideMenuStyle =
  "left-0 absolute md:fixed pt-14 border-box md:w-64 w-16 bg-slate-50 md:pt-5 z-40 h-full md:pl-3";

const routes = [
  { to: "/dashboard/qr-scanner", label: "QR Scanner", icon: "qr_code_scanner" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "query_stats" },
  { to: "/dashboard/scan-logs", label: "Scan Records", icon: "history" },
  { to: "/dashboard/bulletin", label: "Bulletin Manager", icon: "feed" },
  { to: "/dashboard/accounts", label: "Accounts", icon: "manage_accounts" },
  {
    to: "/dashboard/rfid-devices",
    label: "Locations & Devices",
    icon: "sensors",
  },
];

const Dashboard = () => {
  const [pageLabel, setLabel] = useState(false);
  const [redir, setRedir] = useState(false);
  const [md, setMenu] = useState(false);
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

  const setHeader = () => {
    setLabel(
      routes.find((route) => {
        return route.to === location.pathname;
      })?.label || ""
    );
  };
  const handleMenuClick = () => {
    setMenu((prev) => !prev);
  };
  useEffect(() => {
    setHeader();
  }, [location]);

  useEffect(() => {
    document.title = "Admin dashboard | " + CLIENT_NAME;
  }, []);

  return (
    <>
      {redir ? (
        <div className="w-full h-screen">
          <Loading text={"Unauthorized, redirecting"} />
        </div>
      ) : (
        <div className="flex md:ml-64 bg-white h-screen">
          <div className="md:block hidden">
            <Sidemenu handleMenuClick={handleMenuClick} />
          </div>
          <div className="">
            {md && <Sidemenu handleMenuClick={handleMenuClick} />}
          </div>

          <div className="flex flex-col pt-14 w-full">
            <DashboardNav
              pageLabel={pageLabel}
              handleMenuClick={handleMenuClick}
            />
            <div className="w-full h-screen overflow-y-scroll p-5">
              <React.Suspense fallback={<Loading />}>
                <div className="relative w-full flex box-border">
                  <div className="w-full flex">
                    <Routes>
                      <Route path={"/accounts/:id"} element={<AccountPage />} />
                      <Route path={"/accounts"} element={<ManageAccounts />} />
                      <Route path={"/bulletin"} element={<ManageBulletin />} />
                      <Route path={"/qr-scanner"} element={<AdminScanner />} />
                      <Route path={"/scan-logs"} element={<ManageScanLogs />} />
                      <Route path={"/analytics"} element={<Analytics />} />
                      <Route
                        path={"/rfid-devices"}
                        element={<ManageDevices />}
                      />
                    </Routes>
                  </div>
                </div>
              </React.Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const DashboardNav = ({ pageLabel, handleMenuClick }) => {
  return (
    <div className="fixed md:block top-0 py-3 px-4 w-full z-50  select-none max-h-16 ">
      <span className="flex w-full items-center">
        <span
          onClick={handleMenuClick}
          className="material-icons-sharp md:hidden inline-block  active:text-slate-50 active:bg-sky-600 text-3xl"
        >
          menu
        </span>
        <span className="font-bold ml-7 md:ml-0 text-xl text-slate-700">
          {pageLabel}
        </span>
      </span>
    </div>
  );
};

export const Sidemenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={sideMenuStyle}>
      <span className="font-bold hidden md:block text-2xl text-center -ml-3 text-slate-800 pb-5">
        {CLIENT_NAME}
      </span>
      {routes.map((route) => {
        return (
          <NavLink
            end={route.end || false}
            key={route.to}
            to={route.to}
            className={({ isActive }) => (isActive ? activeStyle : defStyle)}
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
