import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserManagement, PaymentManagement, ProductManagement, KreasiManagement, TipsManagement, GaleriManagement, OrderManagement } from "../../components";
import Home from "../Home";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State loading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    // Ambil activeTab dari localStorage jika ada
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }

    // Simulasi loading sebelum menampilkan konten
    setTimeout(() => setIsLoading(false), 1000); // Delay 1 detik sebelum konten muncul
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab"); // Hapus activeTab saat logout
    navigate("/login");
    window.location.replace("/login");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSettingDropdown = () => {
    setIsSettingOpen(!isSettingOpen);
  };

  const handleTabChange = (tab) => {
    if (tab === "home") {
      navigate("/home"); // Navigasi ke halaman home
    } else {
      setActiveTab(tab);
      localStorage.setItem("activeTab", tab); // Simpan activeTab ke localStorage
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "payment":
        return <PaymentManagement />;
      case "products":
        return <ProductManagement />;
      case "kreasis":
        return <KreasiManagement />;
      case "tips":
        return <TipsManagement />;
      case "galeri":
        return <GaleriManagement />;
      case "order":
        return <OrderManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-64 bg-gray-800 text-white h-full">
        <div className="mb-8 p-4">
          <img src="/asset/image/logo-footer.svg" alt="Logo" className="w-32 mt-6 mx-auto" />
        </div>
        <nav className="space-y-2 px-4">
          <button onClick={() => handleTabChange("users")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "users" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            👤 Manajemen Akun
          </button>
          <button onClick={() => handleTabChange("products")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "products" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            🛒 Products
          </button>

          <button onClick={toggleSettingDropdown} className="w-full text-left flex items-center justify-between py-2 px-4 rounded hover:bg-gray-700">
            ⚙ Setting
          </button>
          {isSettingOpen && (
            <div className="ml-4 space-y-2">
              <button onClick={() => handleTabChange("kreasis")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "kreasis" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                🎨 Kreasi
              </button>
              <button onClick={() => handleTabChange("tips")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "tips" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                📖 Tips
              </button>
              <button onClick={() => handleTabChange("galeri")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "galeri" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                🖼 Galeri
              </button>
            </div>
          )}

          <button onClick={() => handleTabChange("order")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "order" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            📦 Order
          </button>
          <button onClick={() => handleTabChange("home")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "home" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            🖥️ Preview
          </button>
          <button onClick={handleLogout} className="w-full text-left flex items-center py-2 px-4 text-red-400 hover:bg-gray-700 rounded">
            🚪 Keluar
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-hidden">
 <div className="sticky top-0 bg-white z-20 shadow-sm">
          <div className="flex justify-end items-center p-4 lg:p-0">
            <button className="sm:block lg:hidden p-2 hover:bg-gray-100 rounded" onClick={toggleSidebar}>
              ☰
            </button>
          </div>
        </div>

        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-30">
            <nav className="space-y-2 p-4">
              <button onClick={handleLogout} className="w-full text-left block py-2 px-4 text-red-400 hover:bg-gray-700 rounded">
                Keluar
              </button>
            </nav>
          </div>
        )}

        {isSidebarOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50" onClick={toggleSidebar} />}

        <div className="overflow-auto h-[calc(100vh-64px)] flex justify-center items-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Memuat data...</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;