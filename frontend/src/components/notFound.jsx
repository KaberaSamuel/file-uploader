import { Link } from "react-router-dom";
import "../styles/error-page.css";

function NotFoundPage() {
  return (
    <div className="internal-error error-page">
      <h1>The page you're looking for isn't available</h1>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default NotFoundPage;
