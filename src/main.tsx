import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LangDex from "./pages/Langdex";
import Battle from "./pages/Battle";
import Navbar from "./components/Navbar";
import StarterPage from "./pages/StarterPage";
import Capture from "./pages/Capture";
import CaptureUnlock from "./pages/CaptureUnlock";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/langdex" element={<LangDex />}/>
        <Route path="/capture" element={<Capture />}/>
        <Route path="/battle" element={<Battle />}/>
        <Route path="/starter" element={<StarterPage />} />
        <Route path="/unlock" element={<CaptureUnlock />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
