import React from "react";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
import deleteIcon from "../../images/delete.svg";
const routes = [
  { to: "/", label: "home" },
  { to: "/about", label: "about" },
  { to: "/bulletin", label: "bulletin" },
];
export const Navbar = () => {
  return (
    <div className="p-3 flex justify-between">
      <span className="">
        <img
          src=""
          alt="LOGO"
          className=" justify-self-start inline-block h-12 w-1/12 border-2"
        />
      </span>
      <span>
        <span className=" w-fit inline-flex mx-7">
          {routes.map((route) => (
            <NavItem route={route} key={route.label} />
          ))}
        </span>

        <span className="inline-block w-max">
          <Button
            onClick={() => {}}
            label="Join us"
            icon={{
              size: "17",
              src: deleteIcon,
              alt: "del",
            }}
          />
          <Button onClick={() => {}} label="Login" />
          <Button
            onClick={() => {}}
            icon={{
              size: "20",
              src: deleteIcon,
              alt: "del",
              position: "right",
            }}
          />
        </span>
      </span>
    </div>
  );
};
