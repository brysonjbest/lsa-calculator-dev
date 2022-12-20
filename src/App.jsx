import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ErrorPage from "./views/Error/error-page";

import CalculatorLanding from "./views/Calculator/CalculatorLanding";
import CalculatorPersonal from "./views/Calculator/CalculatorPersonal";
import CalculatorDelegated from "./views/Calculator/CalculatorDelegated";

import BasicProfile from "./views/SelfRegistration/BasicProfile";
import MilestoneSelection from "./views/SelfRegistration/MilestoneSelection";
import ProfileDetails from "./views/SelfRegistration/ProfileDetails";
import Supervisor from "./views/SelfRegistration/Supervisor";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);
  const testReference = useRef();
  const secondtestReference = useRef();

  return (
    <div className="App">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<CalculatorLanding />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="delegated" element={<CalculatorDelegated />} />
            <Route path="personal" element={<CalculatorPersonal />} />
            <Route path="register">
              <Route path="profile" element={<BasicProfile />} />
              <Route path="milestone" element={<MilestoneSelection />} />
              <Route path="details" element={<ProfileDetails />} />
              {/* to update to awards */}
              <Route path="award" element={<ProfileDetails />} />
              <Route path="supervisor" element={<Supervisor />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}
