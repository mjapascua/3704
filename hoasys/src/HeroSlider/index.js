import React, { useState } from "react";

function HeroSlider({ imgArr }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="relative text-center w-full">
        <button
          className="opacity-0 float-left h-full w-1/4 inline-block absolute top-0 left-0"
          onClick={() =>
            count < 1 ? setCount(imgArr.length - 1) : setCount(count - 1)
          }
        >
          Previous
        </button>
        <img className="w-full object-cover h-scrn-8" src={imgArr[count]} />
        <button
          className="opacity-0 float-right h-full w-1/4 inline-block absolute top-0 right-0"
          onClick={() =>
            count < imgArr.length - 1 ? setCount(count + 1) : setCount(0)
          }
        >
          Next
        </button>
      </div>
      <div className=" text-center mt-4">
        {imgArr.map((item, index) => (
          <span
            key={index}
            onClick={() => setCount(index)}
            className={
              (index === count ? " border border-gray-500" : "bg-gray-400") +
              " rounded-xl mx-1 inline-block w-2.5 h-2.5 "
            }
          />
        ))}
      </div>
    </>
  );
}

export default HeroSlider;
