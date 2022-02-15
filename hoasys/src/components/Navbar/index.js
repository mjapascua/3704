import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
const routes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];
export const Navbar = () => {
  return (
    <div className="px-7 pt-4 pb-5 sticky top-0 z-10 bg-gray-50 shadow-sm select-none flex justify-between">
      <span className="">
        <img src="" alt="LOGO" />
      </span>

      <span>
        <span className=" w-fit inline-flex mr-8">
          {routes.map((route) => (
            <NavItem route={route} key={route.label} />
          ))}
        </span>

        <span className="inline-flex w-max">
          <Button onClick={() => {}}>
            <NavLink to={"/signup"}>
              Join Us
            </NavLink>
          </Button>
          <Button
            onClick={() => {}}
            classes="bg-gray-700 ml-1 text-white hover:bg-kape-500 transition-color"
          >
            <NavLink to={"/login"}>
              Login
            </NavLink>
          </Button>
        </span>
      </span>
    </div>
  );
};
