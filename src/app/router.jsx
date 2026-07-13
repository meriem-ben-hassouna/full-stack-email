import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Login from "../features/auth/Login.jsx";
import Register from "../features/auth/Register.jsx";
import Dashboard from "../features/dashboard/Dashboard.jsx";
import Contacts from "../features/contacts/Contacts.jsx";
import Groups from "../features/groups/Groups.jsx";
import EmailComposer from "../features/email/EmailComposer.jsx";
import UploadExcel from "../features/upload/UploadExcel.jsx";
import History from "../features/history/History.jsx";
import Settings from "../features/settings/Settings.jsx";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/contacts", element: <Contacts /> },
      { path: "/groups", element: <Groups /> },
      { path: "/email", element: <EmailComposer /> },
      { path: "/upload", element: <UploadExcel /> },
      { path: "/history", element: <History /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default router;
