import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forms.css";

function Login() {
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formFields),
      });

      if (response.status === 200) {
        window.location = "/folders";
      } else if (response.status === 401) {
        const { message } = await response.json();
        setErrorMessage(message);
      }
    } catch (error) {
      console.error(error);
      window.Location = "/internal-server-error";
    }
  }

  const { email, password } = formFields;

  return (
    <div>
      <nav>
        <div>
          <Link to="/folders">File Uploader</Link>
        </div>

        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>

      <main className="form-container login">
        <h1>Login</h1>
        <p>
          Don't have an account yet ? <Link to="/signup">Sign Up</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label> Email* </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  [e.target.name]: e.target.value,
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
                  [e.target.name]: e.target.value,
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
