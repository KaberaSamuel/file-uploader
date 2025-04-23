import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./styles/App.css";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  async function handleAuthorization() {
    const response = await fetch("http://localhost:3000/home");

    if (response.status == 200) {
      setUser(await response.json());
      console.log(user);
    } else {
      // window.location = "/login";
    }
  }

  handleAuthorization();

  return (
    <div className="app">
      <div>
        <nav>
          <Link to="/folders">File Uploader</Link>
          <Link to="/logout">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </Link>
        </nav>

        <h1>Welcome to the homepage</h1>
      </div>
    </div>
  );
}

export default App;
