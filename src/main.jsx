import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "./theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import store from "./app/store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
