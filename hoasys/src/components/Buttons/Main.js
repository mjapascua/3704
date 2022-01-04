import React, { Children } from "react";

export const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={
        props.classes +
        " font-display transition-transform inline-flex max-w-xs select-none py-2 items-center justify-center font-semibold text-sm rounded-sm"
      }
    >
      <span
        className={
          Children.count(props.children) === 1
            ? " px-4"
            : " min-w-full w-28 flex justify-between items-center px-5"
        }
      >
        {props.children}
      </span>
    </button>
  );
};
