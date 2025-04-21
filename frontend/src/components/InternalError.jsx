import { Link } from "react-router-dom";
import "../styles/InteralErrorPage.css";

function InternalErrorPage() {
  return (
    <div className="internal-error-component">
      <h1>Sorry, We've encountered an internal server error</h1>

      <Link to="/">Back to homepage</Link>
    </div>
  );
}

export default InternalErrorPage;
