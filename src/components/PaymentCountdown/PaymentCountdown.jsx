import React, { useState, useEffect } from "react";
import { Text } from "..";

const PaymentCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 jam dalam detik

  useEffect(() => {
    // Mengambil waktu tersimpan dari localStorage
    const savedTime = localStorage.getItem("paymentCountdown");
    if (savedTime) {
      const remaining = parseInt(savedTime) - Math.floor(Date.now() / 1000);
      if (remaining > 0) {
        setTimeRemaining(remaining);
      }
    } else {
      // Jika tidak ada waktu tersimpan, set waktu baru
      const endTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      localStorage.setItem("paymentCountdown", endTime.toString());
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem("paymentCountdown");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <Text
        as="p"
        className="flex items-center justify-center border border-solid border-black bg-gray-300 px-[34px] py-1 text-[18px] font-normal text-black"
      >
        Bayar dalam {formatTime(timeRemaining)}
      </Text>
    </div>
  );
};

export default PaymentCountdown;
