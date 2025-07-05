import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { apiUrl } from "../../service";
import Navbar from "./Navbar";
import LoaderButton from "./LoaderButton";
import "../styles/public.css";

function SignUp() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  const [pending, setPending] = useState(false);

  const { username, password1, password2 } = formFields;
  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { dataTree, allUsers } = useAuth();
  const user = dataTree[0];

  // Effect to track password fields change
  useEffect(() => {
    if (password2 !== "" && password1 !== password2) {
      setErrorMessage("Passwords don't match");
    } else {
      setErrorMessage("");
    }
  }, [password1, password2]);

  // Effect to track username field change
  useEffect(() => {
    if (allUsers.includes(username)) {
      setErrorMessage("User already present");
    } else {
      setErrorMessage(null);
    }
  }, [username]);

  // redirecting user to the homepage if already authenticated
  if (user) return <Navigate to="/folders" />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allUsers.includes(username)) {
      if (password1 === password2) {
        setPending(true);
        await fetch(`${apiUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formFields),
        });
        navigate("/login");
        setPending(false);
      } else {
        alert("passwords don't match");
      }
    } else {
      setErrorMessage("User already present");
    }
  }

  return (
    <div className="public">
      <Navbar />

      <main>
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <p>
            Already have an account ? <Link to="/login">Login</Link>
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

          <LoaderButton pending={pending}>
            <button type="submit">Sign Up</button>
          </LoaderButton>
        </form>
      </main>
    </div>
  );
}

export default SignUp;
