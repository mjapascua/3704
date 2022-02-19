import { useEffect } from "react";
import axios from "axios";
import HeroSlider from "../components/HeroSlider";

function Home() {
  useEffect(() => {
    axios.get("http://localhost:5000").then((res) => console.log(res));
  }, []);

  return (
    <>
      <main>
        <HeroSlider
          imgArr={[
            "https://res.cloudinary.com/demo/image/upload/sample.gif",
            "https://res.cloudinary.com/demo/basketball_shot.jpg",
            "https://www.researchgate.net/profile/Elif-Bayramoglu/publication/322918596/figure/fig3/AS:669304651530259@1536586072864/Sample-example-of-xeriscape-URL-3.jpg",
          ]}
        />
        Testing
        <span className=" h-28 mb-24 w-52 justify-center mx-auto flex flex-col">
          <span className=" flex items-center">
            <span className="p-2 inline-block bg-meadow-50" />
            <span className="p-2 inline-block bg-meadow-100" />
            <span className="p-2 inline-block bg-meadow-200" />
            <span className="p-2 inline-block bg-meadow-300" />
            <span className="p-2 inline-block bg-meadow-400" />
            <span className="p-2 inline-block bg-meadow" />
            <span className="p-2 inline-block bg-meadow-600" />
            <span className="p-2 inline-block bg-meadow-700" />
            <span className="p-2 inline-block bg-meadow-800" />
            <span className="p-2 inline-block bg-meadow-900" />
            <p className=" inline-block w-20 text-meadow-600 font-bold font-display ml-2">
              MEADOW
            </p>
          </span>
          <span className=" flex items-center">
            <span className="p-2 inline-block bg-salmon-50" />
            <span className="p-2 inline-block bg-salmon-100" />
            <span className="p-2 inline-block bg-salmon-200" />
            <span className="p-2 inline-block bg-salmon-300" />
            <span className="p-2 inline-block bg-salmon-400" />
            <span className="p-2 inline-block bg-salmon" />
            <span className="p-2 inline-block bg-salmon-600" />
            <span className="p-2 inline-block bg-salmon-700" />
            <span className="p-2 inline-block bg-salmon-800" />
            <span className="p-2 inline-block bg-salmon-900" />
            <p className=" inline-block w-20 text-salmon-600 font-bold font-display ml-2">
              SALMON
            </p>
          </span>
          <span className=" flex items-center">
            <span className="p-2 inline-block bg-kape-50" />
            <span className="p-2 inline-block bg-kape-100" />
            <span className="p-2 inline-block bg-kape-200" />
            <span className="p-2 inline-block bg-kape-300" />
            <span className="p-2 inline-block bg-kape-400" />
            <span className="p-2 inline-block bg-kape" />
            <span className="p-2 inline-block bg-kape-600" />
            <span className="p-2 inline-block bg-kape-700" />
            <span className="p-2 inline-block bg-kape-800" />
            <span className="p-2 inline-block bg-kape-900" />
            <p className=" inline-block w-20 text-kape-600 font-bold font-display ml-2">
              KAPE
            </p>
          </span>

          <span className=" flex items-center">
            <span className="p-2 inline-block bg-gray-50" />
            <span className="p-2 inline-block bg-gray-100" />
            <span className="p-2 inline-block bg-gray-200" />
            <span className="p-2 inline-block bg-gray-300" />
            <span className="p-2 inline-block bg-gray-400" />
            <span className="p-2 inline-block bg-gray-500" />
            <span className="p-2 inline-block bg-gray-600" />
            <span className="p-2 inline-block bg-gray-700" />
            <span className="p-2 inline-block bg-gray-800" />
            <span className="p-2 inline-block bg-gray-900" />
            <p className=" inline-block w-20 text-gray-600 font-bold font-display ml-2">
              GRAY
            </p>
          </span>
          <p className="text-xs text-left text-gray-300">manamejef</p>
        </span>
      </main>
    </>
  );
}

export default Home;
