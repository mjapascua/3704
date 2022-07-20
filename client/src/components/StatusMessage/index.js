import React from "react";
const defClass = " w-full flex items-center h-fit p-2 md:py-0 md:px-2 ";
const StatusMessage = ({ text, status, className }) => {
  let style = className + defClass;
  if (status >= 200 && status <= 299) {
    style = style + " bg-emerald-500";
  } else style = style + " bg-salmon-200";

  return (
    <>
      {text ? (
        <span
          className={
            "rounded-sm border text-red-700 border-salmon-400 " + style
          }
        >
          {text}
          <span></span>
        </span>
      ) : (
        <span className={defClass}></span>
      )}
    </>
  );
};

export default StatusMessage;
