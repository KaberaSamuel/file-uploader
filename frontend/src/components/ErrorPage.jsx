import { Link, useRouteError } from "react-router-dom";
import "../styles/error-page.css";

function ErrorPage() {
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <div className="404-error error-page">
        <h1>Page not found</h1>
        <Link to="/">Back to homepage</Link>
      </div>
    );
  }

  return (
    <div className="internal-error error-page">
      <h1>Hang on, We've encountered an error</h1>
    </div>
  );
}

export default ErrorPage;
