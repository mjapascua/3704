import React from "react";
import { NavLink } from "react-router-dom";
const defStyle =
  "navlink text-sm text-left cursor-pointer font-bold py-2 mx-6 w-fit";

export const NavItem = ({ route }) => {
  return (
    <NavLink
      to={route.to}
      className={({ isActive }) =>
        isActive ? "active-navlink " + defStyle : " text-gray-500 " + defStyle
      }
    >
      {route.label.toUpperCase()}
    </NavLink>
  );
};
