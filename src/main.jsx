import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { CartProvider } from "./components";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Router>
      <CartProvider>
        <App /> {/* Pindahkan Routes ke dalam komponen App */}
      </CartProvider>
    </Router>
  </StrictMode>
);
