import React from "react";
import { ReactComponent as Place } from "../../images/place_white_24dp.svg";
import { ReactComponent as Phone } from "../../images/phone_white_24dp.svg";
import { ReactComponent as Email } from "../../images/email_white_24dp.svg";

export const Footer = () => {
  return (
    <footer className="absolute text-center px-7 w-full flex-col lg:flex-row pt-3 pb-6 z-10 bg-gray-800 text-white shadow-sm select-none flex justify-between">
      <span className=" w-fit inline-flex mx-7">
        <p>LOGO</p>
      </span>
      <span>
        <span className=" text-xs">powered by </span>
        <b>ResPass</b>
      </span>
    </footer>
  );
};
