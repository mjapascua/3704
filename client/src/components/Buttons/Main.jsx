import React, { Children } from "react";
const primaryClass = " mb-3 min-h-11 bg-violet-700 text-white ";
const secondaryClass = " min-h-11 border border-violet-700 text-violet-600 ";
export const Button = React.forwardRef((props, ref) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={
        props.className +
        " font-display box-border select-none py-2 items-center justify-center font-semibold text-sm rounded-sm disabled:bg-gray-300 disabled:text-gray-700 disabled:border-gray-300" +
        (props.primary && primaryClass) +
        (props.secondary && secondaryClass)
      }
      ref={ref}
      disabled={props.disabled}
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
});
