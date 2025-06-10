import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider from "./components/AuthProvider.jsx";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import NotFoundPage from "./components/NotFound.jsx";
import { FolderItem, DefaultFolderItem } from "./components/FolderItem.jsx";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/folders",
    element: <App />,
    children: [
      {
        index: true,
        element: <DefaultFolderItem />,
      },
      {
        path: "/folders/:id",
        element: <FolderItem />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  </StrictMode>
);
