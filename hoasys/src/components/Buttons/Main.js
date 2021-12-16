import React from "react";
import { Icon } from "../Icon";

export const Button = (props) => {
  console.log(props.label && props.icon);
  return (
    <span
      onClick={props.onClick}
      className={
        props.classes +
        " bg-stone-700 inline-flex  relative max-w-xs align-middle items-center h-11 content-center justify-center font-semibold px-5 cursor-pointer text-sm mx-1 rounded-sm text-white"
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
