import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { PublicNavbar } from "./navbars.jsx";
import "../styles/forms.css";
import Loader from "./Loader.jsx";
import { useAuth } from "./AuthProvider.jsx";
import { apiUrl } from "../../service.js";

function Login() {
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formFields;

  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { setUser, user, isLoading, setIsLoading } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formFields),
    });

    if (!response.ok) {
      const { message } = await response.json();
      setErrorMessage(message);
    } else {
      const { user } = await response.json();
      setUser(user);

      // showing a loading screen when redirecting the user
      setIsLoading(true);
      navigate("/").then(
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  // redirecting the user to the homepage if already authenticated
  if (user) return <Navigate to="/folders" />;

  return (
    <div>
      <PublicNavbar />

      <main className="form-container login">
        <h1>Login </h1>
        <p>
          Don't have an account yet ? <Link to="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label> Username* </label>
            <input
              type="email"
              name="username"
              value={username}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  username: e.target.value,
                });
              }}
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label> Password* </label>
            <input
              type={seePassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  password: e.target.value,
                });
              }}
              placeholder="Your password"
              minLength="8"
              required
            />
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              onClick={() => {
                setSeePassword(!seePassword);
              }}
            />
            <label> Show Password</label>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div>
            <button type="submit">Log In</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
