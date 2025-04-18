import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./styles/App.css";

function App() {
  return (
    <div className="app">
      <div>
        <nav>
          <Link to="/">File Uploader</Link>
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
