import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigasi ke halaman sebelumnya
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black text-white font-sans">
            <div className="text-center p-6 rounded-lg bg-gray-800 shadow-xl max-w-lg w-full">
                <div className="text-6xl text-red-500 mb-4">
                    <span>❓</span>
                </div>
                <h1 className="text-3xl font-bold mb-6 text-red-500">Halaman Tidak Ditemukan</h1>
                <p className="text-lg mb-4">Kami tidak dapat menemukan halaman yang Anda cari.</p>
                <p className="text-base mb-6">Periksa kembali URL atau kembali ke halaman sebelumnya.</p>
                <button
                    onClick={handleGoBack}
                    className="px-6 py-2 text-black bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none"
                >
                    Kembali
                </button>
            </div>
        </div>
    );
};

export default NotFound;
