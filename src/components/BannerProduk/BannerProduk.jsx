import React, { useState, useEffect } from "react";
import { Img } from "../Img/Img";

export const BannerProduk = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerData = [
    {
      image: "/asset/image/BannerProduk1.svg",
      discount: "50%",
      text: "OFF",
      textColor: "text-white",
      layout: "default",
    },
    {
      image: "/asset/image/BannerProduk2.svg",
      discount: "11",
      text: "11",
      textColor: "text-black",
      layout: "split",
    },
    {
      image: "/asset/image/BannerProduk3.svg",
      leftText: "BIG",
      rightTexts: ["SALE", "SALE", "SALE", "SALE"],
      textColor: "text-white",
      layout: "multiple",
    },
  ];

  // Fungsi untuk pindah ke slide berikutnya
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  // Menangani perubahan konten berdasarkan layout
  const renderSlideContent = () => {
    const currentData = bannerData[currentSlide];

    switch (currentData.layout) {
      // 11-11
      case "split":
        return (
          <>
            <b
              className={`absolute top-0 sm:top-[70px] md:top-[70px] lg:top-[70px] left-[210px] sm:left-[175px] md:left-[175px] lg:left-[175px] text-[120px] sm:text-[158px] md:text-[158px] lg:text-[158px] font-bold
              ${currentData.textColor} [text-shadow:1px_0_0_#000,0_1px_0_#000,-1px_0_0_#000,0_-1px_0_#000] font-helvetica`}
            >
              {currentData.discount}
            </b>
            <b
              className={`absolute top-0 sm:top-[70px] md:top-[70px] lg:top-[70px] right-[210px] sm:right-[175px] md:right-[175px] lg:right-[175px] text-[120px] sm:text-[158px] md:text-[158px] lg:text-[158px] font-bold
              ${currentData.textColor} [text-shadow:1px_0_0_#000,0_1px_0_#000,-1px_0_0_#000,0_-1px_0_#000] font-helvetica`}
            >
              {currentData.text}
            </b>
          </>
        );

      // BIG SALE
      case "multiple":
        return (
          <>
            <b
              className="absolute top-[40px] sm:top-[90px] md:top-[90px] lg:top-[90px] left-[15px] sm:left-[105px] md:left-[105px] lg:left-[105px] text-[38px] sm:text-[108px] md:text-[108px] ;g:text-[108px] text-white font-bold
              [text-shadow:1px_0_0_#000,0_1px_0_#000,-1px_0_0_#000,0_-1px_0_#000] font-helvetica"
            >
              {currentData.leftText}
            </b>
            <div className="absolute top-[20px] sm:top-[20px] md:top-[20px] lg:top-0 right-[15px] sm:right-[195px] md:right-[195px] lg:right-[105px] flex flex-col gap-0">
              {currentData.rightTexts.map((text, index) => (
                <b
                  key={index}
                  className="text-[38px] sm:text-[108px] md:text-[108px] lg:text-[108px] text-white font-bold leading-[0.8] tracking-wider"
                  style={{
                    textShadow:
                      "1px 0 0 #000, 0 1px 0 #000, -1px 0 0 #000, 0 -1px 0 #000] font-helvetica",
                  }}
                >
                  {text}
                </b>
              ))}
            </div>
          </>
        );

      // 50% OFF
      default:
        return (
          <>
            <b
              className="absolute 
                        top-[20px] sm:top-[20px] md:top-[50px] lg:top-[-10px]
                        left-[20px] sm:left-[150px] md:left-[250px] lg:left-[70px]
                        text-[50px] sm:text-[120px] md:text-[150px] lg:text-[158px]
                        text-white font-bold
              [text-shadow:1px_0_0_#000,0_1px_0_#000,-1px_0_0_#000,0_-1px_0_#000] font-helvetica"
            >
              {currentData.discount}
            </b>
            <b
              className="absolute 
                        top-[90px] sm:top-[80px] md:top-[100px] lg:top-[115px]
                        left-[250px] sm:left-[200px] md:left-[450px] lg:left-[678px]
                        text-[50px] sm:text-[80px] md:text-[120px] lg:text-[158px]
                        text-white font-bold
              [text-shadow:1px_0_0_#000,0_1px_0_#000,-1px_0_0_#000,0_-1px_0_#000] font-helvetica"
            >
              {currentData.text}
            </b>
          </>
        );
    }
  };

  // Menambahkan slide otomatis dengan interval
  useEffect(() => {
    const interval = setInterval(nextSlide, 2000); // Ganti setiap 3 detik

    // Bersihkan interval saat komponen dibersihkan
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative border border-black h-[200px] sm:h-[338px] md:h-[400px] lg:h-[338px] overflow-hidden w-full mt-[58px] mb-[74px]">
      <Img
        className="absolute inset-0 w-full h-full object-cover object-center"
        alt=""
        src={bannerData[currentSlide].image}
      />

      {/* Arrow Button */}
      {/* <button
        onClick={nextSlide}
        className="absolute top-[55px] sm:top-[131px] md:top-[131px] lg:top-[131px] right-[32px] w-[55px] h-[56px] cursor-pointer z-10 rounded-full bg-white border border-black transition-colors hover:bg-black group"
      >
        <svg
          width="23"
          height="32"
          sm:width="20"
          sm:height="28"
          md:width="22"
          md:height="30"
          lg:width="24"
          lg:height="32"
          viewBox="0 0 24 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <path
            d="M2 2L20 16L2 30"
            stroke="black"
            strokeWidth="3"
            className="group-hover:stroke-white transition-colors"
          />
        </svg>
      </button> */}

      <div className="absolute bottom-0 left-0 w-full h-[37px] bg-white border-t border-black" />

      {/* Slider Dots */}
      <div className="absolute bottom-[11px] left-1/2 transform -translate-x-1/2 flex gap-[12px]">
        {bannerData.map((_, index) => (
          <div
            key={index}
            className={`w-[10px] h-[10px] rounded-full border border-black 
              ${currentSlide === index ? "bg-black" : "bg-white"}`}
          />
        ))}
      </div>

      {renderSlideContent()}
    </div>
  );
};

export default BannerProduk;
