//frontend/src/components/CategoryFilter/CategoryFilter.jsx
import React, { useState } from "react";

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    skinColor: false,
    bodyShape: false,
  });

  const toggleDropdown = (categoryName) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "Warna Kulit") {
      toggleDropdown("skinColor");
    } else if (categoryName === "Bentuk Badan") {
      toggleDropdown("bodyShape");
    } else {
      onCategoryChange(categoryName);
    }
  };

  return (
    <div className="border border-black ml-6 w-[200px] p-0">
      <div className="text-4xl font-bold text-black text-left px-6 py-2">
        Filter
      </div>
      <hr className="border-black" />

      <div>
        <button
          onClick={() => handleCategoryClick("Semua")}
          className={`${
            activeCategory === "Semua"
          } block w-full text-left text-lg px-6 py-2 hover:bg-black hover:text-white`}
        >
          Semua
        </button>
        <hr className="border-black" />
      </div>

      <div>
        <button
          onClick={() => handleCategoryClick("Warna Kulit")}
          className={`${
            activeCategory === "Warna Kulit" ? "text-blue-600" : "text-black"
          } block w-full text-left text-lg px-6 py-2 hover:bg-black hover:text-white`}
        >
          Warna Kulit
        </button>

        {isDropdownOpen.skinColor && (
          <div className="pl-4 mt-2">
            <button
              onClick={() => onCategoryChange("Warna Kulit Terang")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Terang
            </button>
            <button
              onClick={() => onCategoryChange("Warna Kulit Sawo Matang")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Sawo Matang
            </button>
            <button
              onClick={() => onCategoryChange("Warna Kulit Gelap")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Gelap
            </button>
          </div>
        )}
        <hr className="border-black" />
      </div>

      <div>
        <button
          onClick={() => handleCategoryClick("Bentuk Badan")}
          className={`${
            activeCategory === "Bentuk Badan" ? "text-blue-600" : "text-black"
          } block w-full text-left text-lg px-6 py-2 hover:bg-black hover:text-white`}
        >
          Bentuk Badan
        </button>

        {isDropdownOpen.bodyShape && (
          <div className="pl-4 mt-2">
            <button
              onClick={() => onCategoryChange("Bentuk Badan Kurus")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Kurus
            </button>
            <button
              onClick={() => onCategoryChange("Bentuk Badan Sedang")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Sedang
            </button>
            <button
              onClick={() => onCategoryChange("Bentuk Badan Gemuk")}
              className="block w-full text-sm py-1 px-2 text-left hover:text-gray-600"
            >
              Gemuk
            </button>
          </div>
        )}
        <hr className="border-black" />
      </div>
    </div>
  );
};

export default CategoryFilter;
