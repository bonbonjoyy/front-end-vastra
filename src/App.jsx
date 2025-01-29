import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Masuk from "./pages/Login/Masuk";
import Register from "./pages/Login/Register";
import Password from "./pages/Login/Password";
import UserProfile from "./pages/UserProfile";
import Order from "./pages/Order";
import OrderDetail from "./pages/Order/OrderDetail";
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
import Pembayaran from "./pages/Pembayaran";
import DetailBank from "./pages/Pembayaran/DetailBank";
import DetailEwallet from "./pages/Pembayaran/DetailEwallet";
import Selesai from "./pages/Selesai";
import Denim from "./pages/Harian/Denim";
import Casual from "./pages/Harian/Casual";
import Smartcasual from "./pages/Harian/Smartcasual";
import Tropical from "./pages/Harian/Tropical";
import Flannel from "./pages/Harian/Flannel";
import Sporty from "./pages/Harian/Sporty";
import Polo from "./pages/Harian/Polo";
import Streetwear from "./pages/Harian/Streeatwear";
import Arabicdress from "./pages/Khusus/Arabicdress";
import Vintage from "./pages/Khusus/Vintage";
import Hiker from "./pages/Khusus/Hiker";
import Theroyal from "./pages/Khusus/Theroyal";
import Hiphop from "./pages/Khusus/Hiphop";
import Wintercoat from "./pages/Khusus/Wintercoat";
import Military from "./pages/Khusus/Military";
import Biker from "./pages/Khusus/Biker";
import Fullbodysuit from "./pages/Formal/Fullbodysuit";
import Batik from "./pages/Formal/Batik";
import PreppySweater from "./pages/Formal/PreppySweater";
import PreppyCardigan from "./pages/Formal/PreppyCardigan";
import SmartCasuall from "./pages/Formal/SmartCasuall";
import Casuall from "./pages/Formal/Casuall";
import Kreasi from "./pages/Kreasi/Index";
import Admin from "./pages/Admin";
import { PrivateRoute } from "./components";
import ResetPassword from "./pages/Login/ResetPassword";
import Unauthorized from "./pages/Unauthorized.jsx";

const App = () => {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<Masuk />} />
      <Route path="/login" element={<Masuk />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/lupa-password" element={<Password />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />

      {/* Private routes */}
      <Route path="/Harian" element={<PrivateRoute><Harian /></PrivateRoute>} />
      <Route path="/UserProfile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      <Route path="/Order" element={<PrivateRoute><Order /></PrivateRoute>} />
      <Route path="/Order/Detail/:orderId" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
      <Route path="/Formal" element={<PrivateRoute><Formal /></PrivateRoute>} />
      <Route path="/Khusus" element={<PrivateRoute><Khusus /></PrivateRoute>} />
      <Route path="/Tips-Bahan" element={<PrivateRoute><TipsBahan /></PrivateRoute>} />
      <Route path="/Tips-Warna" element={<PrivateRoute><TipsWarna /></PrivateRoute>} />
      <Route path="/Tips-Aksesoris" element={<PrivateRoute><TipsAksesoris /></PrivateRoute>} />
      <Route path="/Produk-Kami/Kaos" element={<PrivateRoute><ProdukKaos /></PrivateRoute>} />
      <Route path="/Produk-Kami/Jaket" element={<PrivateRoute><ProdukJaket /></PrivateRoute>} />
      <Route path="/Produk-Kami/Aksesoris" element={<PrivateRoute><ProdukAksesoris /></PrivateRoute>} />
      <Route path="/Produk-Kami/:category/:id" element={<PrivateRoute><ProdukDetail /></PrivateRoute>} />
      <Route path="/Kreasi" element={<PrivateRoute><Kreasi /></PrivateRoute>} />
      <Route path="/Pembayaran" element={<PrivateRoute><Pembayaran /></PrivateRoute>} />
      <Route path="/detail-bank" element={<PrivateRoute><DetailBank /></PrivateRoute>} />
      <Route path="/detail-ewallet" element={<PrivateRoute><DetailEwallet /></PrivateRoute>} />
      <Route path="/selesai" element={<PrivateRoute><Selesai /></PrivateRoute>} />
      <Route path="/Denim" element={<PrivateRoute><Denim /></PrivateRoute>} />
      <Route path="/Casual" element={<PrivateRoute><Casual /></PrivateRoute>} />
      <Route path="/Smartcasual" element={<PrivateRoute><Smartcasual /></PrivateRoute>} />
      <Route path="/Tropical" element={<PrivateRoute><Tropical /></PrivateRoute>} />
      <Route path="/Flannel" element={<PrivateRoute><Flannel /></PrivateRoute>} />
      <Route path="/Sporty" element={<PrivateRoute><Sporty /></PrivateRoute>} />
      <Route path="/Polo" element={<PrivateRoute><Polo /></PrivateRoute>} />
      <Route path="/Streetwear" element={<PrivateRoute><Streetwear /></PrivateRoute>} />
      <Route path="/Arabicdress" element={<PrivateRoute><Arabicdress /></PrivateRoute>} />
      <Route path="/Vintage" element={<PrivateRoute><Vintage /></PrivateRoute>} />
      <Route path="/Hiker" element={<PrivateRoute><Hiker /></PrivateRoute>} />
      <Route path="/Theroyal" element={<PrivateRoute><Theroyal /></PrivateRoute>} />
      <Route path="/Hiphop" element={<PrivateRoute><Hiphop /></PrivateRoute>} />
      <Route path="/Military" element={<PrivateRoute><Military /></PrivateRoute>} />
      <Route path="/Wintercoat" element={<PrivateRoute><Wintercoat /></PrivateRoute>} />
      <Route path="/Biker" element={<PrivateRoute><Biker /></PrivateRoute>} />
      <Route path="/Fullbodysuit" element={<PrivateRoute><Fullbodysuit /></PrivateRoute>} />
      <Route path="/Batik" element={<PrivateRoute><Batik /></PrivateRoute>} />
      <Route path="/PreppySweater" element={<PrivateRoute><PreppySweater /></PrivateRoute>} />
      <Route path="/PreppyCardigan" element={<PrivateRoute><PreppyCardigan /></PrivateRoute>} />
      <Route path="/SmartCasuall" element={<PrivateRoute><SmartCasuall /></PrivateRoute>} />
      <Route path="/Casuall" element={<PrivateRoute><Casuall /></PrivateRoute>} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute requiredRole="admin">
            <Admin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
