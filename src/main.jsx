import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { loadPage } from "./App";
import InAppBrowser from "./components/InAppBrowser";
import "./styles.css";

// Resolve the initial route and its CSS before mounting, avoiding an empty Suspense frame.
await loadPage(window.location.pathname.replace(/\/+$/, "") || "/");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <InAppBrowser />
  </StrictMode>,
);
