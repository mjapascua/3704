import React, { useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AdminAccounts } from "./Admin/AdminAccounts";
import AdminBulletin from "./Admin/AdminBulletin";
import { AdminScanner } from "./Admin/AdminScanner";

const activeStyle =
  "text-slate-50 bg-gray-700 w-full flex text-sm align-center cursor-pointer justify-center md:justify-start mb-4 py-5 px-8";
const defStyle =
  "text-gray-500 w-full text-sm flex align-center cursor-pointer justify-center md:justify-start mb-4 py-5 px-8";

const routes = [
  { to: "/dashboard", label: "Dashboard", icon: "home" },
  { to: "/dashboard/bulletin", label: "Manage bulletin", icon: "feed" },
  { to: "/dashboard/qr-scanner", label: "QR Scanner", icon: "qr_code_scanner" },
  { to: "/dashboard/accounts", label: "Accounts", icon: "manage_accounts" },
];

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [pageLabel, setLabel] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    setOpen((prev) => !prev);
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

  return (
    <div className=" font-display">
      <DashboardNav
        handleMenuClick={handleMenuClick}
        pageLabel={pageLabel}
        open={open}
      />

      <div className="pt-14 relative w-full flex h-screen box-border">
        {open && <Sidemenu />}
        <div className="w-full overflow-scroll">
          <Routes>
            <Route path={"/accounts"} element={<AdminAccounts />} />
            <Route path={"/bulletin"} element={<AdminBulletin />} />
            <Route path={"/qr-scanner"} element={<AdminScanner />} />
          </Routes>
        </div>
      </div>
    </div>
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

export const Sidemenu = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-neutral-900 block z-20 left-0 w-max h-full box-border">
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
            <span className="md:w-max md:block hidden">
              <b>{" " + route.label}</b>
            </span>
          </NavLink>
        );
      })}
      <span
        onClick={() => navigate("/", { replace: true })}
        className={defStyle}
      >
        <span className="material-icons-sharp md:mr-5">logout</span>
        <b className="md:w-max md:block hidden">Logout</b>
      </span>
    </div>
  );
};
