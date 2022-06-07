import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "../components/Buttons/Main";
import { postCategories } from "../utils/general";
import { apiClient } from "../utils/requests";

const Article = () => {
  const [data, setData] = useState({ header_image: { url: "" } });
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const authConfig = {
    headers: {
      Authorization: "Bearer " + user?.token,
    },
  };

  const datePub = new Date(data?.createdAt).toLocaleString(undefined, {
    dateStyle: "full",
  });
  const bgStr = data.header_image.url.toString();

  const handleInteract = () => {
    apiClient
      .get("bulletin/" + id + "/like", user ? authConfig : null)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      });
  };

  const fetchArticle = useCallback(() => {
    apiClient.get("bulletin/" + id, user ? authConfig : null).then((res) => {
      if (res.status === 200) {
        setData(res.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return (
    <div className="bg-slate-50 flex flex-col items-center w-full">
      <div className="z-10 w-4/5 flex justify-center items-center flex-col">
        <div className=" w-full h-fit md:mt-44 px-10 py-7 text-center bg-gray-800 rounded-t-md bg-opacity-30 backdrop-blur-sm">
          <h1 className=" text-4xl font-head mb-7 mx-auto w-fit px-2 text-white font-bold">
            {data?.title}
          </h1>
          {data?.tags?.map((tag) => {
            return (
              <span
                key={tag}
                className={
                  postCategories[tag].color +
                  " text-white px-4 py-2 m-2 rounded-sm font-semibold"
                }
              >
                {postCategories[tag].text}
              </span>
            );
          })}
        </div>

        <div className="inline-block shadow-sprd w-full rounded-b-md bg-white mb-20 py-5 px-10 font-medium">
          <span className="flex justify-between pb-4 mb-8 border-b">
            <span>
              <h4 className=" text-gray-400 text-lg">{datePub}</h4>
              <h4 className=" text-gray-600 ">
                {data?.author?.fname +
                  " " +
                  data?.author?.lname.charAt(0) +
                  "."}
              </h4>
            </span>
            <Button
              className={
                "border-gray-200 border group disabled:!bg-white " +
                (data?.liked ? "text-violet-700 disabled:!text-violet-700" : "")
              }
              disabled={user ? false : true}
              onClick={handleInteract}
            >
              {data?.liked ? (
                <span
                  className={
                    "material-icons-sharp text-2xl transition-all " +
                    (user && "group-active:scale-150")
                  }
                >
                  favorite
                </span>
              ) : (
                <span
                  className={
                    "material-icons-outlined transition-all text-2xl " +
                    (user && "group-active:scale-150")
                  }
                >
                  favorite_border
                </span>
              )}

              {data?.likes}
            </Button>
          </span>

          <p className="h-fit my-10 mx-20 px-10 overflow-hidden text-lg">
            {data?.text}
          </p>
        </div>
      </div>

      <div
        className="w-full h-112 fixed object-cover -mt-10 bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${bgStr})` }}
      ></div>
    </div>
  );
};

export default Article;
