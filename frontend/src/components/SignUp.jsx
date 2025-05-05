import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PublicNavbar } from "./navbars.jsx";
import { useAuth } from "./AuthProvider.jsx";
import { apiUrl } from "../../service.js";
import "../styles/forms.css";

function SignUp() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const { username, password1, password2 } = formFields;
  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { user } = useAuth();

  // useEffect to checkpasswords
  useEffect(() => {
    function checkPasswords() {
      if (password2 !== "" && password1 !== password2) {
        setErrorMessage("Passwords don't match");
      } else {
        setErrorMessage("");
      }
    }

    checkPasswords();
  }, [password1, password2]);

  // redirecting user to the homepage if already authenticated
  if (user) return <Navigate to="/" />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (password1 === password2) {
      await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formFields),
      });
      navigate("/login");
    } else {
      alert("passwords don't match");
    }
  }

  return (
    <div>
      <PublicNavbar />

      <main className="form-container">
        <h1>Sign Up</h1>
        <p>
          Already have an account ? <Link to="/login">Login</Link>
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
              placeholder="jackToph456@gmail.com"
              required
            />
          </div>

          <div>
            <label>Password*</label>
            <input
              type={seePassword ? "text" : "password"}
              name="password1"
              value={password1}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  password1: e.target.value,
                });
              }}
              placeholder="12345678"
              minLength="8"
              required
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type={seePassword ? "text" : "password"}
              name="password2"
              value={password2}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  password2: e.target.value,
                });
              }}
              placeholder="12345678"
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
            <button type="submit">Create Account</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SignUp;
