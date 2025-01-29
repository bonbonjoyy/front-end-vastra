import React from "react";

const ImageGallery = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          onClick={() => onImageClick(image)} // Tetap tangani klik gambar
        >
          {/* Gambar */}
          <img
            src={image.src}
            alt={`Image ${index + 1}`}
            className="w-full h-auto" // Hapus class hover/zoom
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
