import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ReturnButton = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let from =
    location.state?.from?.pathname || (props.default ? props.default : "/");

  return (
    <span
      onClick={() =>
        props.callback ? props.callback() : navigate(from, { replace: true })
      }
      className="material-icons-sharp flex items-center shadow justify-center rounded-full h-10 w-10 bg-white text-slate-400 hover:text-slate-800 cursor-pointer text-2xl"
    >
      arrow_back
    </span>
  );
};
