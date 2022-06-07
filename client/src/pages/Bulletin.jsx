import { useEffect, useState, useCallback } from "react";
import { WidePreview } from "../components/ArticlePreviews/WidePreview";
import { apiClient } from "../utils/requests";

function Bulletin() {
  const [articles, setArticles] = useState([]);

  const getArticles = useCallback(() => {
    apiClient.get("bulletin").then((res) => {
      setArticles(res.data.data);
    });
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className="w-5/6 md:w-3/4 mx-auto">
      {articles.map((item) => (
        <WidePreview article={item} key={item._id} />
      ))}
    </div>
  );
}

export default Bulletin;
