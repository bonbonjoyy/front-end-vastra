import React, { useState } from "react";
import { Button, Img, Text, Heading, useCart } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PaymentCountdown from "../../components/PaymentCountdown/PaymentCountdown";
import { Link } from "react-router-dom";

const ewalletOptions = [
  {
    id: "dana",
    name: "Dana",
    logo: "/asset/image/dana.svg",
    description:
      "Lakukan Pembayaran menggunakan DANA ke nomor virtual account berikut.",
    phoneNumber: "085712345678",
  },
  {
    id: "gopay",
    name: "GoPay",
    logo: "/asset/image/gopay.svg",
    description:
      "Lakukan Pembayaran menggunakan GoPay ke nomor virtual account berikut.",
    phoneNumber: "085798765432",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    logo: "/asset/image/spay.svg",
    description:
      "Lakukan Pembayaran menggunakan ShopeePay ke nomor virtual account berikut.",
    phoneNumber: "085723456789",
  },
];

export default function DetailEwallet() {
  const [selectedEwallet, setSelectedEwallet] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const { cartItems } = useCart();

  const handleEwalletSelect = (ewallet) => {
    setSelectedEwallet(ewallet);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage(`Teks berhasil disalin: ${text}`);
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full sm:max-w-md md:max-w-lg mx-auto">
      {/* E-Wallet Selection */}
      <Heading as="h2" className="text-2xl font-semibold mb-4 text-center">
        Pilih E-Wallet
      </Heading>
      <div className="flex flex-col gap-4 mb-4">
        {ewalletOptions.map((ewallet) => (
          <div
            key={ewallet.id}
            onClick={() => handleEwalletSelect(ewallet)}
            className={`border p-4 cursor-pointer transition-all ${
              selectedEwallet?.id === ewallet.id
                ? "border-black"
                : "border-gray-300 hover:border-black"
            }`}
          >
            <div className="flex items-center justify-between">
              <Text className="text-lg font-medium">{ewallet.name}</Text>
              <Img src={ewallet.logo} alt={ewallet.name} className="h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Details */}
      {selectedEwallet && (
        <div className="border-t pt-6 mt-6">
          {/* <Heading as="h3" className="text-xl font-bold text-center mb-4">
            Detail Pembayaran
          </Heading> */}
          
          {/* Payment Amount */}
          {/* <Text className="text-3xl font-bold text-center mb-4 text-black">
            Rp {calculateTotal().toLocaleString()}
          </Text> */}
          
          {/* Countdown */}
          <PaymentCountdown />

          <div className="text-center mt-6">
            {/* E-Wallet Name and Description */}
            <Text className="text-lg font-semibold mb-2">{selectedEwallet.name}</Text>
            <Text className="text-sm text-gray-600 mb-4">{selectedEwallet.description}</Text>

            {/* Phone Number */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text className="text-sm font-medium">Nomor Tujuan</Text>
                <div className="flex items-center">
                  <Text className="text-lg font-medium">{selectedEwallet.phoneNumber}</Text>
                  <Text
                    className="text-sm text-blue-600 ml-2 cursor-pointer"
                    onClick={() => handleCopy(selectedEwallet.phoneNumber)}
                  >
                    Salin
                  </Text>
                </div>
              </div>
            </div>

            {/* Copy Message */}
            {copyMessage && (
              <Text className="text-green-500 text-sm mt-4">{copyMessage}</Text>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
