import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import appStore from "./utils/appStore";
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
      <Provider store={appStore}>
          <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>

  
  // </StrictMode>
);
