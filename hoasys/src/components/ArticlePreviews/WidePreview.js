import React from "react";
import { ReactComponent as EastArrow } from "../../images/east_white_18dp.svg";
import { ProceedButton } from "../Buttons/Proceed";

export const WidePreview = ({ article }) => {
  return (
    <div className=" group mb-8 mt-5 hover:shadow-sprd shadow flex bg-slate-50 rounded ">
      <img
        className="w-2/5 object-cover"
        src={article.photo.url}
        alt={article.photo.text}
        height={"100%"}
      />
      <div className="inline-block w-3/5 pt-4 pb-5 ml-7 pr-4">
        <h1 className=" text-xl font-head border-b border-gray-200 pb-1 font-semibold">
          {article?.title}
        </h1>
        <h4 className=" text-xs font-medium pt-1.5 text-gray-400">
          {article?.datePublished}
        </h4>
        <p className=" h1/4 max-h-44 text-gray-700 mt-3 mb-6 mr-10 overflow-hidden text-sm">
          {article.paragraph}
        </p>
        <ProceedButton classes="w-48 gradient-divided-gray group-hover:gradient-divided-meadow">
          Learn more
          <EastArrow className="group-hover:fill-gray-900 group-hover:translate-x-1.5 transition-transform" />
        </ProceedButton>
      </div>
    </div>
  );
};
