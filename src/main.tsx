import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pokedex from "./pages/Pokedex";
import Battle from "./pages/Battle";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/pokedex" element={<Pokedex />}/>
        <Route path="/battle" element={<Battle />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
