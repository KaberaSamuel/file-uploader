import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider from "./components/AuthProvider.jsx";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        path: "",
        element: <Dashboard />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
