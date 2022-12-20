import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import CalculatorLanding from "./views/Calculator/CalculatorLanding";
import CalculatorPersonal from "./views/Calculator/CalculatorPersonal";
import CalculatorDelegated from "./views/Calculator/CalculatorDelegated";
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
            <Route path="delegated" element={<CalculatorDelegated />} />
            <Route path="personal" element={<CalculatorPersonal />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
