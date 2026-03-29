import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Home from "./pages/Home.tsx";
import Events from "./pages/Events.tsx";
import Event from "./pages/Event.tsx";
import Organizations from "./pages/Organizations.tsx";
import { AuthProvider } from "./context/AuthContext";
import CreateEvent from "./pages/CreateEvent.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "event/:eventId",
        element: <Event />,
      },

      {
        path: "organizations",
        element: <Organizations />,
      },

      {
        path: "create",
        element: <CreateEvent />,
      },

      {
        path: "verify",
        element: <VerifyEmail />,
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmail />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
