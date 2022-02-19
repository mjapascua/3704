import React from "react";
import { ReactComponent as Place } from "../../images/place_white_24dp.svg";
import { ReactComponent as Phone } from "../../images/phone_white_24dp.svg";
import { ReactComponent as Email } from "../../images/email_white_24dp.svg";

export const Footer = () => {
  return (
    <footer className="absolute text-center px-7 w-full flex-col lg:flex-row pt-3 pb-6 z-10 bg-gray-800 text-white shadow-sm select-none flex justify-between">
      <span className="">
        <img src="" alt="LOGO" />
      </span>
      <span className=" w-fit inline-flex mx-7">
        <Place />
        <p>
          Phase 3B Palmera Northwinds, <br></br> San Jose Del Monte, Bulacan
        </p>
      </span>
      <span className=" w-fit inline-flex mx-7">
        <Phone />
        <p>+639176559537</p>
      </span>
      <span className=" w-fit inline-flex mx-7">
        <Email />
        <p>espren.anjo101@gmail.com</p>
      </span>
    </footer>
  );
};
