import React from "react";
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
    <div className="px-7 pt-4 pb-8 select-none flex justify-between">
      <span className="">
        <img src="" alt="LOGO" />
      </span>
      <span>
        <span className=" w-fit inline-flex mx-7">
          {routes.map((route) => (
            <NavItem route={route} key={route.label} />
          ))}
        </span>

        <span className="inline-flex w-max">
          <Button onClick={() => {}} label="Join us" classes="mx-1" />
          <Button onClick={() => {}} label="Login" classes="mx-1" />
          <Button onClick={() => {}} classes="mx-1" />
        </span>
      </span>
    </div>
  );
};
