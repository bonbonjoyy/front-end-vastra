import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'; // Menggunakan ikon mata untuk tampilan gambar penuh

function Smartcasual() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galeriImages, setGaleriImages] = useState([]);

  useEffect(() => {
    const fetchGaleri = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/galeris/kategori/Harian/subCategory/SmartCasual');
        const data = await response.json();
        setGaleriImages(data); // Store gallery data in state
      } catch (error) {
        console.error('Error fetching galeri:', error);
      }
    };

    fetchGaleri();
  }, []);

  const closePopup = () => {
    setSelectedImage(null);
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen overflow-auto">
      <Header />

      <div className="w-full">
        <hr className="border-t border-black" />
      </div>

      <div className="flex flex-col items-center justify-center h-full bg-pink-50 mt-2">
        <h2 className="text-5xl font-bold text-center mt-16 mb-8">Smart Casual</h2>

        <p className="text-black text-justify max-w-5xl px-6 mb-4">
          Outfit smart casual untuk pria adalah gaya berpakaian yang memadukan elemen kasual (santai) dengan sentuhan formal untuk menciptakan tampilan yang rapi namun tetap nyaman. Gaya ini fleksibel dan cocok untuk berbagai situasi semi-formal, seperti acara kantor yang santai, makan malam, atau pertemuan dengan klien.
        </p>
        <p className="text-black text-justify max-w-5xl px-6 mb-8">
          Kelebihan smart casual adalah bahwa ia dapat memberikan tampilan yang terlihat rapi dan terorganisir, namun tetap terlihat santai dan tidak terlalu formal. Selain itu, outfit smart casual juga dapat memberikan kesan profesional tanpa kehilangan kenyamanan.
        </p>
      </div>

      <section className="mt-6 mb-16 bg-white py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl mx-auto px-[145px]">
          {galeriImages.length === 0 ? (
            <div className="col-span-5 text-center text-gray-500 font-semibold">
              <p>No Data Available</p>
            </div>
          ) : (
            galeriImages.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-gray-50 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg transform hover:shadow-xl"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="bg-white overflow-hidden shadow-md w-full max-w-sm">
                  <img
                    src={`http://localhost:3333${item.image}`}
                    alt={`Smart Casual ${index + 1}`}
                    className="object-contain w-full h-56"                    />
                  <div className="p-4 mt-4">
                    <p className="text-center text-gray-800 font-semibold">{item.title || 'No Title'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-full max-w-sm max-h-[90vh] h-auto overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closePopup}
            >
              ✖
            </button>
            <img
              src={`http://localhost:3333${selectedImage}`}
              alt="Selected Smart Casual"
              className="w-full mb-4 max-w-full"
            />
            <div className="flex flex-col items-center justify-between bg-gray-100 p-4">
              <a
                href={`http://localhost:3333${selectedImage}`}
                download
                className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 mb-2 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" /> {/* Ganti dengan faEye */}
                Lihat Gambar Penuh
              </a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Smartcasual;
