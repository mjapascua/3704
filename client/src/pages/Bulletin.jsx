import React, { useEffect, Suspense } from "react";
import Loading from "../components/Loading/Loading";
import { CLIENT_NAME } from "../utils/appInfo";

const ArticleList = React.lazy(() =>
  import("../components/ArticlePreviews/ArticleList")
);

function Bulletin() {
  useEffect(() => {
    document.title = "Bulletin | " + CLIENT_NAME;
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <ArticleList />
    </Suspense>
  );
}

export default Bulletin;
