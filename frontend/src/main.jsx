import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import InternalErrorPage from "./components/InternalError.jsx";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/folders",
    element: <App />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path: "/internal-server-error",
    element: <InternalErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
