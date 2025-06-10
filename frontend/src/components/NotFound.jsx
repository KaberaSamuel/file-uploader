import { Link } from "react-router-dom";
import "../styles/404.css"

function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>The page you're looking for isn't available</h1>
      <Link to="/folders">Go to Homepage</Link>
    </div>
  );
}

export default NotFoundPage;
