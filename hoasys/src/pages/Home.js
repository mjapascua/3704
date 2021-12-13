import { Link } from "react-router-dom";

function Home() {
    return (
      <>
        <main>
          <h2>Welcome to the homepage!</h2>
          <p>This is the first landing page of the System.</p>
        </main>
        <nav>
          <Link to="/about"> About </Link>
          <Link to="/bulletin"> Bulletin </Link>
        </nav>
      </>
    );
  }

  export default Home;