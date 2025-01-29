import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  // Jika token tidak ada, redirect ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    // Dekode token untuk mendapatkan payload
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken);

    // Periksa apakah token sudah kadaluarsa
    const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
    if (decodedToken.exp < currentTime) {
      console.log("Token has expired.");
      return <Navigate to="/login" />;
    }

    // Periksa apakah user memiliki role yang sesuai (optional, jika diperlukan)
    if (requiredRole && decodedToken.user?.role !== requiredRole) {
      console.log("Unauthorized: User does not have the required role");
      return <Navigate to="/unauthorized" />;
    }
  } catch (error) {
    console.log("Invalid token or decoding error:", error);
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
