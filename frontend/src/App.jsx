import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "./styles/App.css";

import { Link, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:3000/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log(response);

      if (response.status === 200) {
        const { user } = await response.json();
        console.log(user);
      } else {
        return <Navigate to="/login" />;
      }
    })();
  }, [navigate]);

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
