import React from "react";
import { Button } from "../Buttons/Main";
import { ReactComponent as EastArrow } from "../../images/east_white_18dp.svg";

export const WidePreview = ({ article }) => {
  return (
    <div className=" mb-8 mt-5 hover:shadow-sprd shadow flex bg-slate-50 rounded overflow-hidden ">
      <img
        className="w-2/5 object-cover"
        src={article.photo?.url}
        alt={article.photo?.text}
        height={"100%"}
      />
      <div className="inline-block w-3/5 pt-3 pb-5 ml-9 pr-4">
        <h1 className=" text-xl font-head border-b border-neutral-200  pb-1 font-semibold">
          {article?.title}
        </h1>
        <h4 className=" text-xs font-medium pt-1.5 text-neutral-400">
          {article?.datePublished}
        </h4>
        <p className=" h1/4 max-h-44 text-neutral-700 mt-3 mb-6 mr-10 overflow-hidden text-sm">
          {article.paragraph}
        </p>
        <Button
          label="Learn more"
          classes="w-44 h-10 text-base"
          icon={
            <EastArrow className="group-hover:fill-neutral-800 group-hover:translate-x-2 group-hover:scale-110 transition" />
          }
        />
      </div>
    </div>
  );
};
