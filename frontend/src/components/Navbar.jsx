import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";
import { apiUrl } from "../../service.js";
import "../styles/navbar.css";

function Navbar() {
  const { dataTree, setDataTree } = useAuth();
  const user = dataTree[0];
  const navigate = useNavigate();

  async function logout() {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 200) {
      setDataTree([null]);
      navigate("/login");
    }
  }

  return user ? (
    <nav>
      <Link to="/folders">File Uploader</Link>

      <FontAwesomeIcon
        className="icon"
        icon={faArrowRightFromBracket}
        onClick={logout}
      />
    </nav>
  ) : (
    <nav>
      <Link to="/folders">File Uploader</Link>

      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
