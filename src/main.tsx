import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Langdex from "./pages/Langdex";
import Battle from "./pages/Battle";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/langdex" element={<Langdex />}/>
        <Route path="/battle" element={<Battle />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
