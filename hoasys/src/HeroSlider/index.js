import React, { useState } from 'react';

function HeroSlider(props) {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times.</p>
            <button onClick={() => setCount(count - 1)}>
                Previous
            </button>
            <img src='props.imgArr'/>
            <button onClick={() => setCount(count + 1)}>
                Next
            </button>
        </div>
    );
}

export default HeroSlider;