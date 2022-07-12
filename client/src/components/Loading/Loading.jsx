import React from "react";

const Loading = (props) => {
  return (
    <div
      className={
        " h-full flex-col flex justify-center items-center bg-white " +
        props.className
      }
    >
      <span className=" font-semibold text-xl animate-pulse text-sky-600">
        {props.text}
      </span>
      <br />
      <span className=" animate-spin border-8 w-8 h-8 rounded-full border-gray-100  border-t-sky-300 border-r-sky-400 border-b-sky-500"></span>
      &nbsp;
    </div>
  );
};

export default Loading;
