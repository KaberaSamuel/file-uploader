import { Link } from "react-router-dom";
import "../styles/forms.css";

function Login() {
  return (
    <div>
      <nav>
        <div>
          <Link to="/">File Uploader</Link>
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
        <form>
          <div>
            <label> Email* </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label> Password* </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              minLength="8"
              required
            />
          </div>

          <div className="checkbox">
            <input type="checkbox" />
            <label> Show Password</label>
          </div>

          <div>
            <button type="submit">Log In</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
