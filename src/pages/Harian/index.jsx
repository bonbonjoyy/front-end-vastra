import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Content from "./content";

import React, { useState, useEffect } from "react";

export default function Harian() {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Cek jika animasi sudah dijalankan sebelumnya
    const animationPlayed = sessionStorage.getItem("hasAnimated");

    if (!animationPlayed) {
      // Jika belum, mulai animasi dan tandai sebagai sudah dijalankan
      setTimeout(() => {
        setHasAnimated(true);
        sessionStorage.setItem("hasAnimated", "true");
      }, 100); // Delay sebelum animasi dimulai
    } else {
      // Jika sudah dijalankan sebelumnya, langsung set ke true
      setHasAnimated(true);
    }
  }, []);

  return (
    <>
      <title>Galeri</title>

      <div className="w-full border border-solid border-blk bg-white-a700">
        <Header className="bg-white-a700" />

        <div
          className={`staggered-animation ${
            hasAnimated ? "staggered-visible" : ""
          }`}
        >
          <div className="stagger-item">
            <Content />
          </div>
        </div>

        <Footer className="mt-[92px]" />
      </div>

      {/* Tambahkan animasi CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .staggered-animation .stagger-item {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }

        .staggered-visible .stagger-item:nth-child(1) {
          animation-delay: 1s;
        }
        .staggered-visible .stagger-item:nth-child(2) {
          animation-delay: 1.5s;
        }
        .staggered-visible .stagger-item:nth-child(3) {
          animation-delay: 0.6s;
        }
      `}</style>
    </>
  );
}
