import React from "react";

const Loading = (props) => {
  return (
    <div
      className={
        " h-full flex-col flex justify-center items-center bg-white " +
        props.className
      }
    >
      <span>{props.text}</span>
      <br />
      <span className=" animate-spin border-4 w-7 h-7 rounded-full border-gray-300 border-l-gray-400 border-t-slate-500 border-r-slate-500"></span>
      &nbsp;
    </div>
  );
};

export default Loading;
