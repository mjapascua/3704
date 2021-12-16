import React from "react";

export const Button = (props) => {
  return (
    <span
      onClick={props.onClick}
      className={
        props.classes +
        " bg-neutral-800 group font-display hover:bg-orange-400 transition-transform inline-flex max-w-xs select-none items-center h-9 justify-center font-semibold cursor-pointer text-sm rounded-sm text-white"
      }
    >
      <span
        className={
          (props.label && props.icon) === undefined
            ? " justify-center px-4 group-hover:text-neutral-800 items-center"
            : " min-w-full w-40 flex justify-between px-4 group-hover:text-neutral-800 items-center"
        }
      >
        {props.label}
        {props.icon == null ? null : props.icon}
      </span>
    </span>
  );
};
