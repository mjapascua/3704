import { useEffect } from "react";

function About() {
  useEffect(() => {
    document.title = "About | Community";
  }, []);
  return (
    <>
      <main></main>
    </>
  );
}

export default About;
