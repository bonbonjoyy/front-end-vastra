//frontend/src/components/index.jsx
import { Button } from "./Button/Button";
import { Heading } from "./Heading/Heading";
import { Img } from "./Img/Img";
import { Text } from "./Text/Text";
import { Input } from "./Input/Input";
import { ChipView } from "./ChipView/ChipView";
import { TipsCard } from "./TipsCard/TipsCard";
import { BannerProduk } from "./BannerProduk/BannerProduk";
import { products, getProductById, getAllProducts } from "./ProdukData";
import { CartProvider, useCart } from "./CartContext/CartContext";
import PaymentCountdown from "./PaymentCountdown/PaymentCountdown";
import UserManagement from "./Dataadmin/UserManagement";
import PaymentManagement from "./Dataadmin/PaymentManagement";
import ProductManagement from "./Dataadmin/ProductManagement";
import KreasiManagement from "./Dataadmin/KreasiManagement";
import TipsManagement from "./Dataadmin/TipsManagement";
import GaleriManagement from "./Dataadmin/GaleriManagement";
import OrderManagement from "./Dataadmin/OrderManagement";
import PrivateRoute from "./PrivateRoute";

export {
  Button,
  Heading,
  Img,
  Text,
  Input,
  ChipView,
  TipsCard,
  BannerProduk,
  products,
  getProductById,
  getAllProducts,
  CartProvider,
  useCart,
  PaymentCountdown,
  UserManagement,
  PaymentManagement,
  ProductManagement,
  KreasiManagement,
  TipsManagement,
  GaleriManagement,
  OrderManagement,
  PrivateRoute,
};
