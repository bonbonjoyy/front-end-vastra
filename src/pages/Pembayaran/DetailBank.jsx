import React, { useState } from "react";
import { Button, Img, Text, Heading, useCart } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PaymentCountdown from "../../components/PaymentCountdown/PaymentCountdown";
import { Link } from "react-router-dom";

const bankOptions = [
  {
    id: "mandiri",
    name: "Bank Mandiri",
    logo: "/asset/image/mandiri.svg",
    description:
      "Lakukan Pembayaran dari rekening bank Mandiri ke nomor virtual account berikut.",
    companyCode: "1234",
    virtualAccount: "56789",
  },
  {
    id: "bca",
    name: "Bank BCA",
    logo: "/asset/image/bca.svg",
    description:
      "Lakukan Pembayaran dari rekening bank BCA ke nomor virtual account berikut.",
    companyCode: "4321",
    virtualAccount: "98765",
  },
];

export default function DetailBank() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const { cartItems } = useCart();

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
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
      {/* Bank Selection */}
      <Heading as="h2" className="text-2xl font-semibold mb-4 text-center">
        Pilih Rekening Tujuan
      </Heading>
      <div className="flex flex-col gap-4 mb-4">
        {bankOptions.map((bank) => (
          <div
            key={bank.id}
            onClick={() => handleBankSelect(bank)}
            className={`border p-4 cursor-pointer transition-all ${
              selectedBank?.id === bank.id
                ? "border-black"
                : "border-gray-300 hover:border-black"
            }`}
          >
            <div className="flex items-center justify-between">
              <Text className="text-lg font-medium">{bank.name}</Text>
              <Img src={bank.logo} alt={bank.name} className="h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Payment Details */}
      {selectedBank && (
        <div className="border-t pt-6 mt-6">
          {/* <Heading as="h3" className="text-xl font-bold text-center mb-4">
            Detail Pembayaran
          </Heading> */}
          
          {/* <Text className="text-3xl font-bold text-center mb-4 text-black">
            Rp {calculateTotal().toLocaleString()}
          </Text> */}
          
          <PaymentCountdown />

          <div className="text-center mt-6">
            {/* Bank Name and Description */}
            <Text className="text-lg font-semibold mb-2">{selectedBank.name}</Text>
            <Text className="text-sm text-gray-600 mb-4">{selectedBank.description}</Text>

            {/* Company Code and Virtual Account */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text className="text-sm font-medium">Kode Perusahaan</Text>
                <div className="flex items-center">
                  <Text className="text-lg font-medium">{selectedBank.companyCode}</Text>
                  <Text
                    className="text-sm text-blue-600 ml-2 cursor-pointer"
                    onClick={() => handleCopy(selectedBank.companyCode)}
                  >
                    Salin
                  </Text>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Text className="text-sm font-medium">Nomor Virtual Account</Text>
                <div className="flex items-center">
                  <Text className="text-lg font-medium">{selectedBank.virtualAccount}</Text>
                  <Text
                    className="text-sm text-blue-600 ml-2 cursor-pointer"
                    onClick={() => handleCopy(selectedBank.virtualAccount)}
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
