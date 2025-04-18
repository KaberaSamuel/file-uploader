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
          <Link to="/register">Sign Up</Link>
        </div>
      </nav>

      <main class="form-container">
        <h1>Login</h1>
        <p>
          Don't have an account yet ? <a href="/register">Sign Up</a>
        </p>
        <form>
          <div>
            <label for="email"> Email* </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label for="password"> Password* </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              minlength="8"
              required
            />
          </div>

          <div class="checkbox">
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
