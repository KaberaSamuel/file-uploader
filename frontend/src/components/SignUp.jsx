import { Form, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/forms.css";

function SignUp() {
  const [formFields, setFormFields] = useState({
    fullname: "",
    email: "",
    password1: "",
    password2: "",
  });

  const { fullname, email, password1, password2 } = formFields;
  const [seePassword, setSeePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password1 === password2) {
      await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formFields),
      });
      window.location = "/login";
    } else {
      alert("passwords don't match");
    }
  }

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

      <main className="form-container">
        <h1>Sign Up</h1>
        <p>
          Already have an account ? <Link to="/login">Login</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name*</label>
            <input
              type="text"
              placeholder="jackToph456"
              name="fullname"
              value={fullname}
              onChange={(e) => {
                setFormFields({
                  ...formFields,
                  [e.target.name]: e.target.value,
                });
              }}
              required
            />
          </div>

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
                  [e.target.name]: e.target.value,
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
                  [e.target.name]: e.target.value,
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
