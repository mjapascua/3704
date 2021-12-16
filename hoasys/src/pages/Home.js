import HeroSlider from "../HeroSlider";

function Home() {
  return (
    <>
      <main>
        <HeroSlider imgArr={['https://picsum.photos/200/300', 'https://picsum.photos/id/237/200/300']} />
        <p>This is the first landing page of the System.</p>
      </main>
    </>
  );
}

export default Home;
