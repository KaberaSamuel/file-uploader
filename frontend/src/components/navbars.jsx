import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { apiUrl } from "../../service.js";

function DashboardNavbar() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  async function logout() {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 200) {
      setUser(null);
      navigate("/login");
    }
  }

  return (
    <nav>
      <Link to="/">File Uploader</Link>
      <div onClick={logout}>
        <FontAwesomeIcon className="icon" icon={faArrowRightFromBracket} />
      </div>
    </nav>
  );
}

function PublicNavbar() {
  return (
    <nav>
      <div>
        <Link to="/">File Uploader</Link>
      </div>

      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </nav>
  );
}

export { DashboardNavbar, PublicNavbar };
