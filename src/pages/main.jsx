import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Harian from "./pages/Harian";
import Formal from "./pages/Formal";
import Khusus from "./pages/Khusus";
import TipsBahan from "./pages/Tips Bahan";
import TipsWarna from "./pages/Tips Warna";
import TipsAksesoris from "./pages/Tips Aksesoris";
import ProdukKaos from "./pages/Produk Kaos";
import ProdukJaket from "./pages/Produk Jaket";
import ProdukAksesoris from "./pages/Produk Aksesoris";
import ProdukDetail from "./pages/Produk Detail";


const App = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/Harian/" element={<Harian />} />
      <Route path="/Formal/" element={<Formal/>} />
      <Route path="/Khusus/" element={<Khusus/>} />
      <Route path="/Tips-Bahan" element={<TipsBahan />} />
      <Route path="/Tips-Warna" element={<TipsWarna />} />
      <Route path="/Tips-Aksesoris" element={<TipsAksesoris />} />
      <Route path="/Produk-Kami/Kaos" element={<ProdukKaos />} />
      <Route path="/Produk-Kami/Jaket" element={<ProdukJaket />} />
      <Route path="/Produk-Kami/Aksesoris" element={<ProdukAksesoris />} />
      <Route path="/Produk-Kami/:category/:id" element={<ProdukDetail />} />
    </Routes>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
