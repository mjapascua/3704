import HeroSlider from "../HeroSlider";

function Home() {
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
        <p>This is the first landing page of the System.</p>
      </main>
    </>
  );
}

export default Home;
