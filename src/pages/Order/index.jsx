import React, { useState, useEffect } from "react";
import { Button, Text, Heading } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast, ToastContainer } from 'react-toastify'; // Impor ToastContainer dan toast
import 'react-toastify/dist/ReactToastify.css'; // Impor CSS untuk toast

export default function Order() {
    const [activeMenu, setActiveMenu] = useState("order");
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Anda harus login terlebih dahulu.");
        navigate("/login");
        return;
      }
      fetchOrders();
      const intervalId = setInterval(fetchOrders, 60000);
    
      return () => clearInterval(intervalId);
    }, []);
    
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Token hilang, silakan login kembali.");
            navigate("/login");
            return;
          }
      
          const response = await api.get("/api/orders/user/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
      
          setOrders(response.data);
        } catch (error) {
          toast.error("Gagal mengambil data pesanan.");
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <>
      <div className="flex w-full flex-col bg-white-a700">
        <Header />
        <div className="mt-[24px] mx-4 md:mx-[123px] lg:mx-[145px] mb-[133px]">
          <div className="flex gap-[40px] flex-col-reverse sm:flex-col md:flex-col lg:flex-row">
            <div className="w-full lg:w-[277px] border border-black mb-auto md:block lg:block hidden">
              <div
                onClick={() => navigate("/")}
                className={`p-6 border-b border-black cursor-pointer transition-colors ${
                  activeMenu === "beranda" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <Text className="text-lg font-bold">Beranda</Text>
              </div>
              <div
                onClick={() => navigate("/UserProfile")}
                className={`p-6 border-b border-black cursor-pointer transition-colors ${
                  activeMenu === "profile" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <Text className="text-lg font-bold">Pengaturan Profil</Text>
              </div>
              <div
                onClick={() => navigate("/Order")}
                className={`p-6 border-b border-black cursor-pointer transition-colors ${
                  activeMenu === "order" ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                <Text className="text-lg font-bold">Pesanan Saya</Text>
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  toast.info("Anda telah logout.");
                  navigate("/login");
                }}
                className="p-6 cursor-pointer hover:bg-gray-100"
              >
                <Text className="text-lg font-bold">Keluar</Text>
              </div>
            </div>

            <div className="flex-1">
              <div className="border border-black p-6">
                <Heading as="h2" className="text-xl font-bold mb-6">
                  Pesanan Saya
                </Heading>
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-300 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          <Text className="text-lg font-bold">
                            Pesanan #{order.id}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Tanggal: {new Date(order.createdAt).toLocaleString()}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Status: {order.status}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Total: Rp {order.total.toLocaleString("id-ID")}
                          </Text>
                        </div>
                        <Button
                          className="mt-4 md:mt-0"
                          style={{ backgroundColor: "black", color: "white" }}
                          onClick={() => navigate(`/Order/Detail/${order.id}`)}
                        >
                          Lihat Detail
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-center text-gray-500">
                    Anda belum memiliki pesanan.
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tambahkan ToastContainer di sini */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Footer />
      </div>
    </>
  );
}
