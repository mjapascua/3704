import React from "react";
import { Link } from "react-router-dom";

export const NavItem = ({ route }) => {
  return (
    <div>
      <Link to={route.to}>
        <h1 className=" hover:underline hover:underline-offset-8 text-sm inline-block cursor-pointer font-semibold p-4 w-28">
          {route.label.toUpperCase()}{" "}
        </h1>
      </Link>
    </div>
  );
};
