import React, { useEffect, useState, useRef, Suspense } from "react";
import { WidePreview } from "../components/ArticlePreviews/WidePreview";
import Loading from "../components/Loading/Loading";
import { apiClient } from "../utils/requests";

const ArticleList = React.lazy(() =>
  import("../components/ArticlePreviews/ArticleList")
);

function Bulletin() {
  useEffect(() => {
    document.title = "Bulletin | " + process.env.REACT_APP_NAME;
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <ArticleList />
    </Suspense>
  );
}

export default Bulletin;
