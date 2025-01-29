import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TabTips from "../../components/Tab Tips";

const data = [
  { textContent: "Kaos", path: "/Produk-Kami/Kaos" },
  { textContent: "Jaket", path: "/Produk-Kami/Jaket" },
  { textContent: "Aksesoris", path: "/Produk-Kami/Aksesoris" },
];

export default function Kategori() {
  const location = useLocation();
  const navigate = useNavigate();

  const getSelectedIndex = () => {
    const currentPath = location.pathname;
    return data.findIndex((item) => item.path === currentPath);
  };

  const [selectedIndex, setSelectedIndex] = useState(getSelectedIndex());

  const handleTabClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  useEffect(() => {
    setSelectedIndex(getSelectedIndex());
  }, [location]);

  return (
    <div className="flex md:flex-row h-36">
      {data.map((d, index) => (
        <TabTips
          {...d}
          key={"produk" + index}
          className={`cursor-pointer ${
            selectedIndex === index
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleTabClick(index, d.path)}
        />
      ))}
    </div>
  );
}
