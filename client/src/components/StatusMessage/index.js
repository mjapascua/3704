import React from "react";

const StatusMessage = ({ active, message, status, className }) => {
  let style = className;
  if (status >= 200 && status <= 299) {
    style = style + " bg-emerald-500";
  } else style = style + " bg-salmon-300";

  return (
    <>
      {active ? (
        <span
          className={
            "w-full block px-2 py-1 rounded-sm border text-red-700 border-salmon-500 " +
            style
          }
        >
          {message}
        </span>
      ) : (
        <span className={"w-full block px-2 py-1 h-7"}></span>
      )}
    </>
  );
};

export default StatusMessage;
