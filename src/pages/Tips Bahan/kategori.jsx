import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Tambahkan useLocation
import TabTips from "../../components/Tab Tips";

const data = [
    { textContent: "Memilih Bahan", path: "/Tips-Bahan" },
    { textContent: "Kombinasi Warna", path: "/Tips-Warna" },
    { textContent: "Penggunaan Aksesoris", path: "/Tips-Aksesoris" },
];

export default function Kategori() {
    const location = useLocation();  // Gunakan useLocation untuk mendapatkan URL saat ini
    const navigate = useNavigate();
    
    // Menentukan index tab yang dipilih berdasarkan URL saat ini
    const getSelectedIndex = () => {
        const currentPath = location.pathname;
        return data.findIndex((item) => item.path === currentPath);
    };

    const [selectedIndex, setSelectedIndex] = useState(getSelectedIndex());

    const handleTabClick = (index, path) => {
        setSelectedIndex(index); // Set index tab yang dipilih
        navigate(path); // Navigasi ke path yang sesuai
    };

    useEffect(() => {
        // Update selectedIndex jika URL berubah (misalnya saat berpindah halaman)
        setSelectedIndex(getSelectedIndex());
    }, [location]);  // Re-run effect ketika location berubah

    return (
        <div className="flex h-[140px] w-full
                        sm:h-[100px] sm:w-[200px]
                        md:h-[140px] md:w-[200px]
                        lg:h-[140px] lg:w-auto  ">
            {data.map((d, index) => (
                <TabTips
                    {...d}
                    key={"tips" + index}
                    className={`cursor-pointer ${selectedIndex === index ? 'bg-black text-white' : 'bg-white text-black'}`}
                    onClick={() => handleTabClick(index, d.path)} // Pasang path untuk navigasi
                />
            ))}
        </div>
    );
}