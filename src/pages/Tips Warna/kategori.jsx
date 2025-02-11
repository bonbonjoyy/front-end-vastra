import React, { Suspense, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import TabTips from "../../components/Tab Tips"; 

const data = [
    { textContent: "Memilih Bahan", path: "/Tips-Bahan" },
    { textContent: "Kombinasi Warna", path: "/Tips-Warna" },
    { textContent: "Penggunaan Aksesoris", path: "/Tips-Aksesoris" },
];

export default function Kategori() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();  // Menggunakan useLocation untuk mendeteksi rute saat ini

    const handleTabClick = (index, path) => {
        setSelectedIndex(index); // Set selected index saat tab diklik
        navigate(path); // Navigasi ke path yang sesuai
    };

    useEffect(() => {
        // Update selectedIndex berdasarkan URL saat ini
        const currentPath = location.pathname;
        const index = data.findIndex(item => item.path === currentPath);
        setSelectedIndex(index);
    }, [location]);

    return (
        <div className="flex h-[140px] w-full
                        sm:h-[100px] sm:w-[200px]
                        md:h-[140px] md:w-[200px]
                        lg:h-[140px] lg:w-auto">
            <Suspense fallback={<div>Loading feed...</div>}>
                {data.map((d, index) => (
                    <TabTips
                        key={"tips" + index}
                        {...d}
                        className={`cursor-pointer ${selectedIndex === index ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => handleTabClick(index, d.path)} 
                    />
                ))}
            </Suspense>
        </div>
    );
}