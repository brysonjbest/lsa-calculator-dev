import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
