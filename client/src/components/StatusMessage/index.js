import React from "react";
const defClass = " w-full flex items-center h-7 px-2 ";
const StatusMessage = ({ active, text, status, className }) => {
  let style = className + defClass;
  if (status >= 200 && status <= 299) {
    style = style + " bg-emerald-500";
  } else style = style + " bg-salmon-300";

  return (
    <>
      {active ? (
        <span
          className={
            "rounded-sm border text-red-700 border-salmon-500 " + style
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
