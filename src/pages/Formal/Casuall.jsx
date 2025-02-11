import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';  // Change to faEye for viewing image
import Footer from '../../components/Footer/Footer';

function Casuall() {
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const [galeriImages, setGaleriImages] = useState([]); // State for the gallery images

  useEffect(() => {
    // Fetch gallery data from the API
    const fetchGaleri = async () => {
      try {
        const response = await fetch('https://back-end-vastra.vercel.app/api/galeris/kategori/Formal/subCategory/Casual');
        const data = await response.json();
        const sortedData = data.sort((a, b) => {
          const numA = parseInt(a.title.match(/\d+/)?.[0]) || 0;
          const numB = parseInt(b.title.match(/\d+/)?.[0]) || 0;
          return numA - numB;
        });

        setGaleriImages(sortedData);
      } catch (error) {
        console.error('Error fetching galeri:', error);
      }
    };

    fetchGaleri();
  }, []);

  // Function to close the popup
  const closePopup = () => {
    setSelectedImage(null);
  };

  const handleDownload = async () => {
    if (selectedImage) {
      try {
        // Ambil gambar sebagai Blob dari Supabase
        const response = await fetch(selectedImage);
        const blob = await response.blob();
  
        // Membuat elemen gambar untuk di-render ke canvas
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
          // Buat canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Set ukuran canvas sesuai dengan gambar
          canvas.width = img.width;
          canvas.height = img.height;
  
          // Gambar ulang gambar ke canvas
          ctx.drawImage(img, 0, 0);
  
          // Konversi ke format JPG
          canvas.toBlob((jpgBlob) => {
            const jpgUrl = URL.createObjectURL(jpgBlob);
  
            // Buat elemen <a> untuk mengunduh gambar
            const link = document.createElement('a');
            link.href = jpgUrl;
            link.download = `image-${Date.now()}.jpg`;
  
            // Klik link untuk mengunduh
            document.body.appendChild(link);
            link.click();
  
            // Hapus elemen setelah selesai
            document.body.removeChild(link);
            URL.revokeObjectURL(jpgUrl);
          }, 'image/jpeg', 0.9); // 0.9 = kualitas JPG tinggi
        };
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };  

  return (
    <div className="font-sans text-gray-900 min-h-screen overflow-auto">
      <Header /> {/* Reusable Header */}

      <div className="w-full">
        <hr className="border-t border-black" />
      </div>

      <div className="flex flex-col items-center justify-center h-full bg-pink-50 mt-2">
        <h2 className="text-5xl font-bold text-center mt-16 mb-8">Casual</h2>

        <p className="text-black text-justify max-w-5xl px-6 mb-4">
          Outfit casual untuk pria adalah gaya pakaian formal menjadi lebih santai dan nyaman, tanpa mengurangi kesan rapi dan profesional. Biasanya, setelan resmi terdiri dari jas atau blazer, celana kain, kemeja berkancing, dan dasi. Dengan menambahkan elemen-elemen kasual pada setelan resmi, dapat menciptakan tampilan yang lebih santai dan lebih mudah diterima dalam berbagai acara non-formal atau semi-formal.
        </p>
        <p className="text-black text-justify max-w-5xl px-6 mb-8">
          Kelebihan casual meliputi anda bisa tetap tampil profesional tetapi lebih santai, memberikan kesan yang lebih modern dan sesuai dengan acara yang lebih informal atau semi-formal. Gaya ini sangat fleksibel dan cocok untuk berbagai kesempatan.
        </p>
      </div>

      <section className="mt-6 mb-16 bg-white py-10">
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-screen-xl mx-auto px-6 lg:px-[145px]">
          {/* Loop through gallery images fetched from API */}
          {galeriImages.length === 0 ? (
            <div className="col-span-5 text-center text-gray-500 font-semibold">
              <p>No Data Available</p>
            </div>
          ) : (
            galeriImages.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-gray-50 hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg transform hover:shadow-xl"
                onClick={() => setSelectedImage(item.image)} // Click image to select
              >
                <div className="bg-white overflow-hidden shadow-md w-full max-w-sm">
                  <img
                    src={item.image}
                    alt={`Casual ${index + 1}`}
                    className="object-contain w-full h-35 sm:h-56 lg:h-56"
                  />
                  <div className="p-4 mt-4">
                    <p className="text-center text-gray-800 font-semibold">{item.title || 'No Title'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-full max-w-sm max-h-[90vh] h-auto overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closePopup}
            >
              ✖
            </button>
            <img src={selectedImage} alt="Selected Casual" className="w-full mb-4 max-w-full" />
            <div className="flex flex-col items-center justify-between bg-gray-100 p-4">
            <button
                onClick={handleDownload}
                className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 mb-2 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </button>
              <a
                href={selectedImage}
                download
                className="bg-green-400 text-white px-4 py-2 hover:bg-green-500 mb-2 w-full flex items-center justify-center"
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

export default Casuall;
