import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import InAppBrowser from "./components/InAppBrowser";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <InAppBrowser />
  </StrictMode>,
);
