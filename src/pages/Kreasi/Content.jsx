import React, { useState, useEffect } from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupImage, setPopupImage] = useState(null);
  const [kulitFilter, setKulitFilter] = useState("");
  const [badanFilter, setBadanFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://back-end-vastra.vercel.app/api/kreasis");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const transformedData = data.map((item) => ({
          src: item.image,
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
      toast.error("Gagal memuat gambar. Pastikan format SVG valid.");
    };
  };

  const filteredImages = images.filter((image) => {
    const { kulit, badan } = image;
    const matchesKulit = kulitFilter ? kulit?.toLowerCase() === kulitFilter.toLowerCase() : true;
    const matchesBadan = badanFilter ? badan?.toLowerCase() === badanFilter.toLowerCase() : true;
    const matchesCategory =
      activeCategory === "Semua" ||
      (activeCategory.toLowerCase().includes("kulit") && kulit?.toLowerCase() === activeCategory.split(" ")[2]?.toLowerCase()) ||
      (activeCategory.toLowerCase().includes("badan") && badan?.toLowerCase() === activeCategory.split(" ")[2]?.toLowerCase());

    return matchesKulit && matchesBadan && matchesCategory;
  });

  if (loading) {
    return (
      <p className="flex justify-center items-center h-screen m-0">
        Sedang Memuat Data...
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 p-4 sm:p-6 md:p-8 lg:pl-32">
      <div className="w-full lg:w-[22%] xl:w-[20%] mt-0 lg:pl-5 lg:mr-10 lg:mt-0">
        <div className="mb-4">
          {/* Filter Kulit */}
          <div className="mb-8">
            <label htmlFor="kulit" className="block text-sm font-semibold">
              Cari berdasarkan warna kulit seperti Terang, Sawo Matang, atau Gelap
            </label>
            <input
              id="kulit"
              type="text"
              value={kulitFilter}
              onChange={(e) => setKulitFilter(e.target.value)}
              className="w-full mt-3 p-2 border-2 border-black rounded"
              placeholder="Cari Warna Kulit"
            />
          </div>

          {/* Filter Badan */}
          <div>
            <label htmlFor="badan" className="block text-sm font-semibold">
              Cari berdasarkan bentuk badan seperti Kurus, Sedang, atau Gemuk
            </label>
            <input
              id="badan"
              type="text"
              value={badanFilter}
              onChange={(e) => setBadanFilter(e.target.value)}
              className="w-full mt-3 p-2 border-2 border-black rounded"
              placeholder="Cari Bentuk Badan"
            />
          </div>
        </div>

        {/* Kategori Filter (dengan fitur filter ini di-disable sementara) */}
        {/* <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        /> */}
      </div>

      <div className="w-full lg:w-[78%] xl:w-[64%]">
        <ImageGallery
          images={filteredImages}
          onImageClick={handleImageClick}
        />
      </div>

      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 w-full max-w-sm max-h-[90vh] h-auto overflow-auto relative rounded-lg">
            <button
              className="absolute top-2 right-2 p-2 text-black bg-white hover:bg-black hover:text-white transition-all"
              onClick={closePopup}
            >
              <FontAwesomeIcon
                icon={faTimes}
                size="lg"
                className="text-2xl stroke-current stroke-2"
              />
            </button>
            <img
              src={popupImage.src}
              alt="Popup"
              className="w-full mb-4 max-w-full"
            />
            <div className="flex flex-col items-center justify-between bg-gray-100 p-4">
              <button
                onClick={() => convertSvgToImage("jpeg")}
                className="bg-blue-500 text-white px-4 py-2 mb-2 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </button>

              <a
                href={popupImage.src}
                rel="noopener noreferrer"
                className="bg-green-400 text-white px-4 py-2 hover:bg-green-500 w-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Lihat Gambar Penuh
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;