import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
const routes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];
const userRoutes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];
export const Navbar = React.memo(() => {
  const navigate = useNavigate();
  let location = useLocation();

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="px-7 py-3 sticky h-16 top-0 z-10 bg-gray-50 shadow-sm select-none flex justify-between">
      <span className="material-icons-sharp md:hidden my-auto text-3xl">
        menu
      </span>
      <span className="my-auto px-4  font-bold">LOGO</span>
      <span className="flex justify-center">
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
              classes=" ml-1 text-white bg-meadow-600 transition-color"
            >
              Login
            </Button>
          </span>
        ) : (
          <span
            onClick={() => navigate("account")}
            className="material-icons-sharp text-4xl cursor-pointer"
          >
            account_circle
          </span>
        )}
      </span>
    </div>
  );
});
