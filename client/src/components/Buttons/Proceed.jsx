import React from "react";
import { Button } from "./Main";
const primClass =
  " bg-slate-700 group-hover:text-gray-800 font-display text-white h-12";

export const ProceedButton = ({ classes, onClick, children }) => {
  return (
    <Button
      onClick={onClick}
      classes={classes + primClass + "  hover:translate-x-1"}
    >
      {children}
    </Button>
  );
};
