import React from "react";
import { CLIENT_NAME } from "../../utils/appInfo";

export const Footer = () => {
  return (
    <footer className="absolute text-center px-7 w-full flex-col lg:flex-row pt-3 pb-6 z-10 bg-gray-800 text-white shadow-sm select-none flex justify-between">
      <span className=" w-fit inline-flex mx-7">
        <p>{CLIENT_NAME}</p>
      </span>
      <span>
        <span className=" text-xs">powered by </span>
        <b>4704</b>
      </span>
    </footer>
  );
};
