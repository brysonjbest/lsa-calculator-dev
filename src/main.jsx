import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ErrorPage from "./views/Error/error-page";

import CalculatorLanding from "./views/Calculator/CalculatorLanding";
import CalculatorPersonal from "./views/Calculator/CalculatorPersonal";
import CalculatorDelegated from "./views/Calculator/CalculatorDelegated";

import BasicProfile from "./views/SelfRegistration/BasicProfile";
import MilestoneSelection from "./views/SelfRegistration/MilestoneSelection";
import ProfileDetails from "./views/SelfRegistration/ProfileDetails";
import Supervisor from "./views/SelfRegistration/Supervisor";
import Confirmation from "./views/SelfRegistration/Confirmation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <CalculatorLanding /> },
      { path: "delegated", element: <CalculatorDelegated /> },
      { path: "personal", element: <CalculatorPersonal /> },
      { path: "personal", element: <CalculatorPersonal /> },
      {
        path: "register",
        children: [
          { path: "profile", element: <BasicProfile /> },
          { path: "milestone", element: <MilestoneSelection /> },
          { path: "details", element: <ProfileDetails /> },
          { path: "award", element: <ProfileDetails /> },
          { path: "supervisor", element: <Supervisor /> },
          { path: "confirmation", element: <Confirmation /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
