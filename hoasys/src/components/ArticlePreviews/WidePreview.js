import React from "react";
import { Button } from "../Buttons/Main";
import { ReactComponent as EastArrow } from "../../images/east_white_18dp.svg";

export const WidePreview = ({ article }) => {
  return (
    <div className=" w-3/4 h-64 mb-10 flex rounded overflow-hidden relative mx-auto border-zinc-200">
      <img
        className="w-2/5 h-full object-cover"
        src={article.photo?.url}
        alt={article.photo?.text}
      />
      <div className=" inline-block ml-8 w-3/5  py-1">
        <h1 className=" text-xl  font-bold">{article?.title}</h1>
        <p className=" h-2/4 mt-3 mb-6 overflow-hidden text-sm">
          {article.paragraph}
        </p>
        <Button
          label="Learn more"
          classes="w-44 h-10 text-base"
          icon={
            <EastArrow className="group-hover:fill-neutral-800 group-hover:translate-x-1.5 transition" />
          }
        />
      </div>
    </div>
  );
};
