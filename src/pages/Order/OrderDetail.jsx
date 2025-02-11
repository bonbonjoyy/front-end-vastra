import React, { useState, useEffect } from "react";
import { Button, Heading, Text } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DetailBank from "../../pages/Pembayaran/DetailBank";
import DetailEwallet from "../../pages/Pembayaran/DetailEwallet";
import { useNavigate, useParams } from "react-router-dom";
import { uploadToSupabase } from "../../components/SupabaseConfig";
import api from "../../utils/api";
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS untuk Toastify

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
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
        toast.error("Token hilang, silakan login kembali."); // Ganti alert dengan toast
        navigate("/login");
        return;
      }

      const response = await api.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response)

      const items = JSON.parse(response.data.items);
      const shippingDetails = JSON.parse(response.data.shipping_details);

      setOrder({
        ...response.data,
        items,
        shipping_details: shippingDetails,
      });
      if (response.data.status === 'Rejected') {
        setRejectComment(response.data.reject_comment || 'Tidak ada komentar');
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error(`Gagal mengambil detail pesanan: ${error.response?.data?.message || error.message}`); // Ganti alert dengan toast
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
    // console.log("handleUploadImage called");

    if (!image) {
      toast.error("Silakan pilih gambar terlebih dahulu!"); // Ganti alert dengan toast
      // console.log("No image selected");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5 MB"); // Ganti alert dengan toast
      // console.log("Image size exceeds 5 MB");
      return;
    }

    const token = localStorage.getItem("token");
    // console.log("Token retrieved:", token);

    const fileParts = image.name.split('.').filter(Boolean);
    const fileName = fileParts.slice(0, -1).join('.');
    const fileType = fileParts.slice(-1)[0];
    const timestamp = new Date().toISOString();
    const newFileName = `${fileName} ${timestamp}.${fileType}`;
    // console.log("New file name:", newFileName);

    const publicUrl = await uploadToSupabase(newFileName, image);
    // console.log("Uploaded image URL:", publicUrl);

    const formData = new FormData();
    formData.append("image", publicUrl);
    formData.append("fileName", newFileName);
    formData.append("orderId", orderId);

    // console.log("FormData prepared:", { orderId });

    try {
      const response = await fetch(
        `https://back-end-vastra.vercel.app/api/orders/upload/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      // console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Response data:", data);
      toast.success(data.message); // Ganti alert dengan toast

      setOrder((prevOrder) => ({
        ...prevOrder,
        image: data.image,
        status: "Waiting Confirm",
      }));

      setShowUploadModal(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Gagal mengunggah gambar: ${error.message}`); // Ganti alert dengan toast
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
      <ToastContainer /> {/* Tambahkan ToastContainer di sini */}
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
                    {order.status === 'Rejected' && (
                      <div className="bg-red-100 p-4 rounded-md">
                        <strong>Alasan Penolakan:</strong>
                        <p>{rejectComment}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Text className="text-lg font-bold">Pembayaran:</Text>
                      {order.image ? (
                        <button
                          onClick={() => handleImageClick(order.image)}
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

                    {/* Tampilkan tombol unggah jika status adalah 'Rejected' */}
                  {order.status === 'Rejected' && (
                    <div className="mt-4">
                      <Button
                        className="mt-2"
                        style={{ backgroundColor: "black", color: "white" }}
                        onClick={() => setShowUploadModal(true)}
                      >
                        Unggah Kembali Bukti Pembayaran
                      </Button>
                    </div>
                  )}

                  {!order.image && order.status !== 'Rejected' && (
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

            {selectedMethod === "bank" && <DetailBank />}
            {selectedMethod === "ewallet" && <DetailEwallet />}

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

            {selectedMethod && (
              <>
                <input
                  type="file"
                  className="border border-gray-300 p-2 mb-4 w-full mx-auto"
                  onChange={handleImageChange}
                />
                <Button
                  className="w-full !bg-black !text-white py-2"
                  onClick={handleUploadImage}
                  disabled={!image}
                >
                  Unggah Bukti
                </Button>
              </>
            )}
          </div>
        </div>
      )}

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