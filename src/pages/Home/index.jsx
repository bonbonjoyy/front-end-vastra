import { Button, Text, Heading, Img } from "../../components";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { Link } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // State untuk animasi

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
      setNotificationMessage('Selamat Datang di Vastra!');
      setShowNotification(true);

      // Menyembunyikan notifikasi setelah 3 detik
      setTimeout(() => {
        setShowNotification(false);
        localStorage.removeItem('isLoggedIn'); // Hapus status login setelah menampilkan notifikasi
      }, 3000);
    }

    // Mengaktifkan animasi setelah komponen dirender
    setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay sebelum animasi dimulai
  }, []);

  return (
    <>
      <title>Home Page</title>

      <div className="w-full bg-white-a700">
        {/* Notifikasi dengan animasi */}
        <div
          className={`notification-bar ${showNotification ? 'show' : 'hide' }`}
        >
          {notificationMessage}
        </div>

        <Header />

        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-5 mx-4 md:mx-0 ${
            isVisible ? 'staggered-animation' : ''
          }`}
        >
          <Img
            src="asset/image/hero.png"
            alt="Image"
            className="stagger-item w-full md:w-1/2 lg:w-[40%] lg:h-[640px] lg:mb-[83px] lg:ml-[67px] h-auto object-contain mb-4 md:mb-0"
          />

          <div className="stagger-item flex flex-col items-start w-full md:w-1/2 md:px-5 md:mb-0 lg:pb-[250px]">
            <Heading
              size="heading"
              as="h1"
              className="text-[32px] sm:text-[38px] md:text-[44px] leading-[55px] font-bold text-blk lg:mb-4"
            >
              <>
                SELAMAT DATANG <br />
                DI VASTRA!
              </>
            </Heading>
            <Text
              as="p"
              className="text-[14px] pr-2 mb-8 mt-4 font-normal leading-7 text-black pr-0
                                    sm:text-[18px] sm:mt-4 
                                    md:pr-[135px] md:mb-4
                                    lg:pr-[135px] lg:mb-4 lg:mt-0"
            >
              Selamat datang di Vastra! Kami hadir sebagai sumber inspirasi bagi kamu yang ingin tampil elegan
              dan percaya diri setiap hari. Apakah kamu mencari referensi outfit untuk keseharian, tren fashion terbaru,
              atau panduan paduan warna yang tepat untuk setiap kesempatan? Di Vastra, kami menawarkan solusi gaya yang
              lengkap dan penuh keanggunan.
            </Text>
            <Button
              shape="square"
              className="hidden lg:block min-w-[124px] px-[23px] border-black border-solid border-2 hover:bg-black hover:text-white transition-all duration-300"
            >
              <Link to="gallery-section" smooth={true} duration={500}>
                Selengkapnya
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-row md:flex-row w-full" id="gallery-section">
          {/* Set Gambar Pertama */}
          <div className="flex flex-col w-full md:w-1/2">
        <div className="relative group">
          <RouterLink to="/Harian" className="block" onClick={scrollToTop}>
            <Img
              src="asset/image/home1.svg"
              alt="Banner Galeri"
              className="h-[250px] md:[300px] lg:h-[400px] w-full object-cover transition duration-300 ease-in-out transform group-hover:brightness-200"
            />
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
              <Text className="text-white text:l md:text:xl lg:text-2xl font-normal">Galeri</Text>
            </div>
          </RouterLink>
        </div>

            <div className="relative group">
              <RouterLink to="" className="block" onClick={scrollToTop}>
                <Img
                  src="asset/image/home2.svg"
                  alt="Banner Trend"
                  className="h-[250px] md:[300px] lg:h-[400px] w-full object-cover transition duration-300 ease-in-out transform group-hover:brightness-200"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
                  <Text className="text-white text:l md:text:xl lg:text-2xl font-normal">
                    Kreasi
                  </Text>
                </div>
              </RouterLink>
            </div>
          </div>

          {/* Set Gambar Kedua */}
          <div className="flex flex-col w-full md:w-1/2">
            <div className="relative group">
              <RouterLink to="/Tips-Bahan" className="block" onClick={scrollToTop}>
                <Img
                  src="asset/image/home3.svg"
                  alt="Banner Tips"
                  className="h-[250px] md:[300px] lg:h-[400px] w-full object-cover transition duration-300 ease-in-out transform group-hover:brightness-200"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
                  <Text className="text-white text:l md:text:xl lg:text-2xl font-normal">
                    Tips
                  </Text>
                </div>
              </RouterLink>
            </div>
            <div className="relative group">
              <RouterLink to="/Produk-Kami/Kaos" className="block" onClick={scrollToTop}>
                <Img
                  src="asset/image/home4.svg"
                  alt="Banner Produk Kami"
                  className="h-[250px] md:[300px] lg:h-[400px] w-full object-cover transition duration-300 ease-in-out transform group-hover:brightness-200"
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
                  <Text className="text-white text:l md:text:xl lg:text-2xl font-normal">
                    Produk Kami
                  </Text>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Tambahkan animasi CSS untuk staggered dan notifikasi */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .notification-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: black;
          color: white;
          text-align: center;
          padding: 10px;
          z-index: 1000;
        }

        .notification-bar.show {
          animation: slideDown 0.5s ease forwards;
        }

        .notification-bar.hide {
          animation: slideUp 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

        .staggered-animation .stagger-item:nth-child(1) {
          animation-delay: 1s;
        }
        .staggered-animation .stagger-item:nth-child(2) {
          animation-delay: 1.5s;
        }
        .staggered-animation .stagger-item:nth-child(3) {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  );
}

