import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { apiUrl, extractData } from "../../service";
import Navbar from "./Navbar";
import LoaderButton from "./LoaderButton";
import "../styles/public.css";

function Login() {
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formFields;

  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { dataTree, setDataTree } = useAuth();
  const [pending, setPending] = useState(false);
  const user = dataTree[0];

  async function handleSubmit(e) {
    e.preventDefault();

    // showing loading screen as we fetch data
    setPending(true);
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
      const dataTree = await extractData(response);
      setDataTree(dataTree);

      navigate("/folders").then(
        setTimeout(() => {
          setPending(false);
        }, 500)
      );
    }
  }

  // redirecting the user to the homepage if already authenticated
  if (user) return <Navigate to="/folders" />;

  return (
    <div className="public">
      <Navbar />

      <main>
        <form onSubmit={handleSubmit}>
          <h1>Login </h1>
          <p>
            Don't have an account yet ? <Link to="/signup">Sign Up</Link>
          </p>

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

          <LoaderButton pending={pending}>
            <button type="submit">Log In</button>
          </LoaderButton>
        </form>
      </main>
    </div>
  );
}

export default Login;
