import React, { useState, useEffect, useRef } from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupImage, setPopupImage] = useState(null);
  const firstImageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333/api/kreasis");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const transformedData = data.map((item) => ({
          src: item.image
            ? `http://localhost:3333${item.image}`
            : "/asset/image/placeholder.svg",
          kulit: item.kulit || null,
          badan: item.badan || null,
        }));

        setImages(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
  };

  const handleImageClick = (image) => {
    setPopupImage(image);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const convertSvgToImage = async (format) => {
    if (!popupImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = popupImage.src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;

      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.download = `image.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    };

    img.onerror = () => {
      alert("Gagal memuat gambar. Pastikan format SVG valid.");
    };
  };

  const filteredImages = images.filter((image) => {
    const { kulit, badan } = image;
    if (activeCategory === "Semua") return true;
    if (activeCategory.toLowerCase().includes("kulit")) {
      return (
        kulit?.toLowerCase() === activeCategory.split(" ")[2]?.toLowerCase()
      );
    }
    if (activeCategory.toLowerCase().includes("badan")) {
      return (
        badan?.toLowerCase() === activeCategory.split(" ")[2]?.toLowerCase()
      );
    }
    return false;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Filter */}
      <div className="w-full lg:w-[22%] xl:w-[20%] p-4 mt-0 lg:mt-0 ml-20">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Galeri */}
      <div className="w-full lg:w-[78%] xl:w-[64%]">
        <ImageGallery
          images={filteredImages}
          onImageClick={handleImageClick}
        />
      </div>

      {/* Popup */}
      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-2/5 max-w-sm relative">
            {/* Tombol Tutup */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closePopup}
            >
              ✖
            </button>

            {/* Gambar */}
            <img
              src={popupImage.src}
              alt="Popup"
              className="w-full mb-4 rounded max-w-full"
            />

            {/* Tombol dengan Ikon */}
            <div className="flex flex-col items-center justify-between bg-gray-100 p-4 rounded">
              {/* Tombol Download JPG */}
              <button
                onClick={() => convertSvgToImage("jpeg")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
