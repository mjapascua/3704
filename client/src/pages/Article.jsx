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
    <div className="flex flex-col bg-slate-100 items-center w-full">
      <div className="z-10 w-4/5 mt-5  items-center flex flex-col">
        <div className=" w-full h-fit px-10 py-7 shadow-md rounded-sm bg-white mb-5s6">
          <h1 className=" text-3xl font-head mb-6  w-fit text-slate-800 font-bold">
            {data?.title}
          </h1>

          {data?.tags?.map((tag) => {
            return (
              <span
                key={tag}
                className={
                  postCategories[tag].color +
                  " text-white px-3 py-1 mr-1 rounded-sm font-semibold"
                }
              >
                {postCategories[tag].text}
              </span>
            );
          })}
          <span className="w-full block border-t py-1 my-2">
            <h4 className=" text-gray-400 text-lg">{datePub}</h4>
            <h4 className=" text-gray-600 ">
              {data?.author?.fname + " " + data?.author?.lname.charAt(0) + "."}
            </h4>
          </span>
        </div>
        <div
          className="w-full h-112 object-cover bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${bgStr})` }}
        ></div>
        <div className="inline-block shadow-md w-full rounded-sm pb-20 bg-white mb-20 py-5 px-10 font-medium">
          <span className="flex justify-between pb-4 mb-8 border-b">
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
    </div>
  );
};

export default Article;
