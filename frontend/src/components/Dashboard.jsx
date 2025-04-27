import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

function Dashboard() {
  const { authenticatedUser: user } = useAuth();
  return (
    <div className="dashboard">
      <div>
        <nav>
          <Link to="/dashboard">File Uploader</Link>
          <Link to="/logout">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </Link>
        </nav>

        <h1>Welcome to the homepage</h1>

        <h1>{user.fullname}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
