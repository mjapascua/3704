import React, { useState } from "react";

const messageComp = {
  status: "",
  style: "",
  text: "",
  display: false,
};

const mesStyles = {
  success: "bg-emerald-500 text-emerald-50",
  fail: "bg-rose-500 text-rose-50",
  neutral: "bg-gray-700 text-gray-50",
};

export const StatusWrapper = (props) => {
  const [status, setStatus] = useState(messageComp);
  return (
    <>
      {status?.display && (
        <span className={mesStyles[status.style]}>{status.text}</span>
      )}
      {props.children}
    </>
  );
};
