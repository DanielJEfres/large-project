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
import Organization from "./pages/Organization.tsx";
import Tickets from "./pages/Tickets.tsx";
import Manage from "./pages/Manage.tsx";
import EventDashboard from "./pages/EventDashboard.tsx";
import EditEvent from "./pages/EditEvent.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
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
        path: "reset",
        element: <ResetPassword />,
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

      { path: "organization/:orgId", element: <Organization /> },

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
      {
        path: "tickets",
        element: <Tickets />,
      },
      {
        path: "manage",
        element: <Manage />,
      },
      { path: "manage/event/:id", element: <EventDashboard /> },
      { path: "manage/event/:eventId/edit", element: <EditEvent /> },
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
