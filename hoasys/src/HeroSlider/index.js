import React, { useState } from 'react';

function HeroSlider({imgArr}) {
    const [count, setCount] = useState(0);

    return (
        <div className='relative'>
            <button className='opacity-0 float-left h-full inline-block absolute top-0 left-0' onClick={() => (count < 1) ? setCount(imgArr.length - 1) : setCount(count - 1)}>
                Previous
            </button>
            <img src={imgArr[count]}/>
            <button className='opacity-0 float-right h-full inline-block absolute top-0 right-0' onClick={() => (count < (imgArr.length - 1)) ? setCount(count + 1) : setCount(0)}>
                Next
            </button>
            <div className=''>
                {imgArr.map((item, index) => <span key={index} className={(index === count ? 'bg-black ' : null) + 'rounded-sm inline-block w-4 h-2 border'} />)}
            </div>
        </div>
    );
}

export default HeroSlider;