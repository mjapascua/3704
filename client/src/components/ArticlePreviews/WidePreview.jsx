import React from "react";
import { Link } from "react-router-dom";
import { postCategories } from "../../utils/general";
import { ProceedButton } from "../Buttons/Proceed";

export const WidePreview = (props) => {
  return (
    <div className=" group mb-8 mt-5 flex-col md:flex-row hover:shadow-sprd shadow flex bg-slate-50 rounded ">
      <img
        className="w-full md:w-2/5 object-cover"
        src={props.article.header_image.url}
        alt={props.article.header_image.text}
        height={"100%"}
      />
      <div className="inline-block w-full md:w-3/5 pt-4 pb-5 px-7 md:pl-7 md:pr-4">
        <span className="mb-2 block">
          {props.article.tags?.map((tag) => {
            return (
              <span
                key={tag}
                className={
                  postCategories[tag].color +
                  " text-white px-2 py-1 text-sm mr-2 rounded-sm font-semibold"
                }
              >
                {postCategories[tag].text}
              </span>
            );
          })}
        </span>

        <h1 className=" text-xl font-head border-b border-gray-200 pb-1 font-semibold">
          {props.article.title}
        </h1>
        <h4 className=" text-xs font-medium pt-1.5 text-gray-400">
          {props.article.createdAt}
        </h4>
        <p className=" h1/4 max-h-44 text-gray-700 mt-3 mb-6 mr-10 overflow-hidden text-sm">
          {props.article.text}
        </p>
        <Link to={"/bulletin/post/" + props.article._id}>
          <ProceedButton classes="md:w-48 transition-transform w-full gradient-divided-gray group-hover:gradient-divided-meadow">
            Learn more
            <span className="material-icons-sharp text-lg group-hover:fill-gray-900 group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </ProceedButton>
        </Link>
      </div>
    </div>
  );
};
