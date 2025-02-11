import React, { useState, useEffect } from "react";
import { Img, Text, Heading, Input, useCart } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

export default function Pembayaran() {
  const { removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    nama_lengkap: "",
    alamat: "",
    kota: "",
    kecamatan: "",
    kode_pos: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  // Ambil email pengguna dari token saat komponen di-mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode token menggunakan jwtDecode
        // console.log("Decoded Payload:", decoded); // Log payload untuk debugging
        const userEmail = decoded.user.email; // Ambil email dari payload
        // console.log("User  Email:", userEmail); // Log email untuk debugging
        setFormData((prevData) => ({
          ...prevData,
          email: userEmail || "", // Set email ke formData
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (showValidation) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[name] = "Bagian ini wajib diisi";
    } else {
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[name] = "Format email tidak valid";
      } else if (name === "phone" && !/^[0-9]{10,13}$/.test(value)) {
        newErrors[name] = "Nomor telepon tidak valid (10-13 digit)";
      } else {
        delete newErrors[name];
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "Bagian ini wajib diisi";
      } else if (key === "email" && !/\S+@\S+\.\S+/.test(formData[key])) {
        newErrors[key] = "Format email tidak valid";
      } else if (key === "phone" && !/^[0-9]{10,13}$/.test(formData[key])) {
        newErrors[key] = "Nomor telepon tidak valid (10-13 digit)";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (paymentMethod) => {
    setShowValidation(true);
    if (validateAllFields()) {
      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
          toast.error("Anda harus login untuk melanjutkan.");
          navigate("/login");
          return;
        }

        const response = await fetch("https://back-end-vastra.vercel.app/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shipping_details: formData,
            items: cartItems,
            total: calculateTotal(),
            paymentMethod,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Pesanan berhasil dibuat!");
          setTimeout(() => {
            navigate("/Selesai");
          }, 3000);
        } else {
          toast.error(data.message || "Terjadi kesalahan saat checkout.");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Gagal menghubungi server. Coba lagi nanti.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex w-full flex-col bg-white-a700">
        <Header />
        <div className="mt-[24px] mx-0 min-h-[806px] mb-[133px]
                        sm:mt-[24px] sm:mx-0 sm:min-h-[806px] sm:mb-[133px]
                        md:mt-[74px] md:mx-[123px] md:min-h-[806px] md:mb-[133px]
                        lg:mt-[74px] lg:mx-[145px] lg:min-h-[806px] lg:mb-[133px]">

          <div className="flex gap-[40px] flex-col-reverse sm:flex-col md:flex-col lg:flex-row">

            {/* Left Section - Forms */}
            <div className="flex-1">
              <form>
                {/* Customer Information */}
                <div className="border border-black p-6">
                  <Heading
                    as="h1"
                    className="text-[18px] font-bold text-black mb-4"
                  >
                    Informasi Pembeli
                  </Heading>
                  <div className="mb-4">
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <Text className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <Heading
                    as="h2"
                    className="text-[18px] font-bold text-black mb-4"
                  >
                    Tujuan Pengiriman
                  </Heading>
                  <div className="space-y-4">
                    {Object.keys(formData).map((key) => {
                      if (key === "email") return null;
                      return (
                        <div key={key}>
                          <Input
                            name={key}
                            placeholder={key
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                            value={formData[key]}
                            onChange={handleInputChange}
                            className={errors[key] ? "border-red-500" : ""}
                            type={key === "phone" ? "tel" : "text"}
                          />
                          {errors[key] && (
                            <Text className="text-red-500 text-sm mt-1">
                              {errors[key]}
                            </Text>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="border-l border-r border-b border-black p-6">
                  <div className="space-y-4">
                    <div
                      onClick={() => handleCheckout("Bayar")}
                      className="border border-black p-4 bg-black text-white hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <Text className="text-[15px] font-medium">
                        Buat Pesanan
                      </Text>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Section - Cart Summary */}
            <div className="w-full sm:w-[277px] md:w-[377px] lg:w-[477px]">
              <div className="border border-black mx-0
                              sm:mx-0
                              md:mr-5
                              lg:mr-5">
                <div className="p-6 border-b border-black">
                  <Text className="text-lg font-bold">Keranjang</Text>
                </div>

                {/* Cart Items */}
                <div className="max-h-[600px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="border-b border-black"
                    >
                      <div className="flex">
                        <div className="w-[127px] h-[147px] border-r border-black">
                          <img
                            src={item.image}
                            alt={item.title}
                            className={`w-full h-full ${
                              item.category === "aksesoris"
                                ? "object-cover object-[50%_100%]"
                                : "object-cover"
                            }`}
                          />
                        </div>
                        <div className="flex-1 px-8 py-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{item.title}</h3>
                              {item.category !== "aksesoris" && (
                                <p className="text-sm mt-1">Ukuran: {item.size}</p>
                              )}
                              <p className="text-lg font-bold text-gray-600">
                                Rp {item.price.toLocaleString()}
                              </p>
                              <p className="text-sm mt-1">Jumlah: {item.quantity}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="w-8 h-8 mt-7 mr-4 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors font-extrabold"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                className="font-extrabold"
                              >
                                <path
                                  fill="currentColor"
                                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Section */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <Text className="text-lg font-bold">Total</Text>
                    <Text className="text-lg font-bold">
                      Rp {calculateTotal().toLocaleString()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}