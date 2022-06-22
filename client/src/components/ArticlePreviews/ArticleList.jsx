import React, { useEffect, useState, useCallback, useRef } from "react";
import { apiClient } from "../../utils/requests";
import Loading from "../Loading/Loading";
import { WidePreview } from "./WidePreview";
import InfiniteScroll from "react-infinite-scroll-component";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  let offset = 0;
  const [total, setTotal] = useState(1);

  const getArticles = useCallback(() => {
    apiClient.get(`bulletin?limit=5&page=${offset}`).then((res) => {
      offset += 1;
      if (total !== res.data.total_count) setTotal(res.data.total_count);
      setTimeout(() => {
        setArticles((prev) => {
          return prev.concat(res.data.data);
        });
      }, 2000);
    });
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="w-5/6 md:w-3/4 mx-auto">
      <InfiniteScroll
        dataLength={articles.length} //This is important field to render the next data
        next={getArticles}
        hasMore={!(total === articles.length)}
        loader={<WideLoading />}
      >
        {articles.map((item, ind) => (
          <WidePreview article={item} key={ind} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

const WideLoading = () => {
  return (
    <div className="  mb-8 mt-5 flex-col md:flex-row flex h-72 bg-slate-100 rounded ">
      <div className="inline-block animate-heavy-pulse bg-slate-200 md:w-2/5 pt-4 pb-5 px-7 md:pl-7 md:pr-4"></div>
      <div className="flex flex-col ml-8 py-4 w-2/5">
        <span className="mb-4 mt-5 inline-block w-44 h-10 animate-heavy-pulse bg-slate-200"></span>
        <span className="mb-4 inline-block w-full h-1 animate-light-pulse bg-slate-200"></span>
        <span className="mb-2 inline-block w-3/4 h-44 mt-4p animate-light-pulse bg-slate-200"></span>
        <span className="md:w-48 block h-16 animate-light-pulse mt-3 bg-slate-200 w-full"></span>
      </div>
    </div>
  );
};

export default ArticleList;
