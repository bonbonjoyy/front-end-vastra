import React, { useState, useEffect } from "react";
import { Button, Heading, Text } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DetailBank from "../../pages/Pembayaran/DetailBank";
import DetailEwallet from "../../pages/Pembayaran/DetailEwallet";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false); // Modal untuk unggah gambar
  const [showImageModal, setShowImageModal] = useState(false); // Modal untuk tampilkan gambar
  const [selectedImage, setSelectedImage] = useState(''); // Menyimpan gambar yang dipilih
  const [selectedMethod, setSelectedMethod] = useState(null); // Track selected method (Bank or E-wallet)
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchOrderDetail();
  }, [orderId, navigate]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token hilang, silakan login kembali.");
        navigate("/login");
        return;
      }

      const response = await api.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response)

      const items = JSON.parse(response.data.items);
      const shippingDetails = JSON.parse(response.data.shipping_details);

      setOrder({
        ...response.data,
        items,
        shipping_details: shippingDetails,
      });
    } catch (error) {
      console.error("Error fetching order detail:", error);
      alert(`Gagal mengambil detail pesanan: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  
  const handleUploadImage = async () => {
    if (!image) {
      alert("Silakan pilih gambar terlebih dahulu!");
      return;
    }
  
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const response = await api.post(`/api/orders/upload/${orderId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log(response.data);
      alert(response.data.message);
  
      setOrder({
        ...order,
        image: response.data.image,
        status: "Waiting Confirm",
      });
      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Gagal mengunggah gambar: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  return (
    <>
      <div className="flex w-full flex-col bg-white-a700">
        <Header />
        <div className="mt-[24px] mx-4 md:mx-[123px] lg:mx-[145px] mb-[133px]">
          <div className="flex flex-col">
            <div className="border border-black p-6">
              <Heading as="h2" className="text-xl font-bold mb-6">
                Detail Pesanan #{orderId}
              </Heading>
              {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : order ? (
                <div>
                  <div className="space-y-4">
                    <Text className="text-lg font-bold">Status: {order.status}</Text>
                    <div className="flex items-center gap-2">
                      <Text className="text-lg font-bold">Pembayaran:</Text>
                      {order.image ? (
                        <button
                          onClick={() => handleImageClick(`http://localhost:3333${order.image}`)}
                          className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                          <i className="fas fa-eye"></i> Bukti
                        </button>
                      ) : (
                        <p className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-xs inline-block">
                          Belum melakukan pembayaran
                        </p>
                      )}
                    </div>

                    <Text className="text-sm text-gray-600">
                      Tanggal: {new Date(order.createdAt).toLocaleString()}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Total: Rp {order.total.toLocaleString("id-ID")}
                    </Text>

                    {/* Upload Bukti Pembayaran */}
                    {!order.image && (
                      <div className="mt-4">
                        <Button
                          className="mt-2"
                          style={{ backgroundColor: "black", color: "white" }}
                          onClick={() => setShowUploadModal(true)}
                        >
                          Unggah Bukti Pembayaran
                        </Button>
                      </div>
                    )}

                    <div>
                      <Heading as="h3" className="text-md font-bold">
                        Barang:
                      </Heading>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="border-b border-gray-200 py-2">
                            <Text>{item.title} x{item.quantity}</Text>
                            <Text className="text-sm text-gray-600">Rp {item.price.toLocaleString("id-ID")}</Text>
                          </div>
                        ))
                      ) : (
                        <Text className="text-center text-gray-500">Tidak ada barang untuk pesanan ini.</Text>
                      )}
                    </div>

                    <div>
                      <Heading as="h3" className="text-md font-bold">
                        Detail Pengiriman:
                      </Heading>
                      <Text>{order.shipping_details?.alamat}</Text>
                      <Text className="text-sm text-gray-600">Phone: {order.shipping_details?.phone}</Text>
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    style={{ backgroundColor: "black", color: "white" }}
                    onClick={() => navigate("/Order")}
                  >
                    Kembali ke Pesanan Saya
                  </Button>
                </div>
              ) : (
                <Text className="text-center text-gray-500">Pesanan tidak ditemukan.</Text>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Modal untuk Unggah Bukti Pembayaran */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
            <button
                onClick={handleCloseUploadModal}
                className="text-gray-500 absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
            >
                X
            </button>
            <Heading as="h3" className="text-lg font-bold mb-4">
                Unggah Bukti Pembayaran
            </Heading>

            {/* Payment Method Selection */}
            {!selectedMethod && (
                <div className="flex justify-center space-x-4">
                <Button
                    className="w-full !bg-black !text-white py-2"
                    onClick={() => handleSelectMethod("bank")}
                >
                    Pilih Bank
                </Button>
                <Button
                    className="w-full !bg-black !text-white py-2"
                    onClick={() => handleSelectMethod("ewallet")}
                >
                    Pilih E-Wallet
                </Button>
                </div>
            )}

            {/* Display selected method details */}
            {selectedMethod === "bank" && <DetailBank />}
            {selectedMethod === "ewallet" && <DetailEwallet />}

            {/* Back Button (to choose method again) */}
            {selectedMethod && (
                <div className="mt-4 text-center">
                <Button
                    className="w-full !bg-gray-500 !text-white py-2"
                    onClick={() => setSelectedMethod(null)}
                >
                    Kembali Pilih Metode Pembayaran
                </Button>
                </div>
            )}

            {/* Upload Payment Image */}
            {selectedMethod && (
                <>
                <input
                    type="file"
                    className="border border-gray-300 p-2 mb-4 w-full mx-auto"
                    onChange={handleImageChange} // Pastikan menambahkan onChange handler untuk memilih gambar
                />
                <Button 
                    className="w-full !bg-black !text-white py-2"
                    onClick={handleUploadImage} // Pastikan tombol ini men-trigger fungsi upload
                    disabled={!image} // Disable tombol jika tidak ada gambar yang dipilih
                >
                    Unggah Bukti
                </Button>
                </>
            )}
            </div>
        </div>
        )}

      {/* Modal untuk Menampilkan Gambar */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
            <button
              onClick={handleCloseImageModal}
              className="text-gray-500 absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
            >
              X
            </button>
            <img
              src={selectedImage}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
