import { useEffect } from "react";
import { WidePreview } from "../components/ArticlePreviews/WidePreview";
import { articlePreviews } from "../utils/populateData";

function Bulletin() {
  useEffect(() => {
    document.title = "Events & News | " + process.env.REACT_APP_NAME;
  }, []);
  return (
    <>
      <div className="w-5/6 md:w-3/4 mx-auto">
        {articlePreviews.map((item) => (
          <WidePreview article={item} key={item.id} />
        ))}
      </div>
    </>
  );
}

export default Bulletin;
