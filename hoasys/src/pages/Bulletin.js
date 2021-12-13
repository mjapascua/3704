import { Link } from "react-router-dom";

function Bulletin() {
    return (
      <>
        <main>
          <h2>How's everyone doing?</h2>
          <p>
            This is the page for news and events of the community.
          </p>
        </main>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </>
    );
}

export default Bulletin;