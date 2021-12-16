import React from "react";
import { Icon } from "../Icon";

export const Button = (props) => {
  return (
    <span
      onClick={props.onClick}
      className={
        props.classes +
        " bg-neutral-800 hover:bg-neutral-500 hover:text-black inline-flex  relative max-w-xs align-middle items-center h-9 content-center justify-center font-semibold px-5 cursor-pointer text-sm mx-1 rounded-sm text-white"
      }
    >
      <span
        className={
          (props.label && props.icon) === undefined
            ? "justify-center"
            : "w-28 flex justify-between"
        }
      >
        {props.label}
        {props.icon == null ? null : <Icon data={props.icon} />}
      </span>
    </span>
  );
};
