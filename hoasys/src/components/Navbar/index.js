import React from "react";
import { Button } from "../Buttons/Main";
import { NavItem } from "./NavItem";
import deleteIcon from "../../images/delete.svg";
import { Icon } from "../Icon";
const routes = [
  { to: "/", label: "home" },
  { to: "/bulletin", label: "bulletin" },
  { to: "/about", label: "about" },
  { to: "/contact", label: "contact" },
];
export const Navbar = () => {
  return (
    <div className="px-7 py-4 flex justify-between">
      <span className="">
        <Icon
          data={{
            size: "50",
            alt: "LOGO",
          }}
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
            }}
          />
        </span>
      </span>
    </div>
  );
};
