import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserManagement, PaymentManagement, ProductManagement, KreasiManagement, TipsManagement, GaleriManagement, OrderManagement } from "../../components";
import Home from "../Home";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false); // State for toggling the dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-64 bg-gray-800 text-white h-full">
        <div className="mb-8 p-4">
          <img src="/asset/image/logo-footer.svg" alt="Logo" className="w-32 mt-6 mx-auto" />
        </div>
        <nav className="space-y-2 px-4">
          <button onClick={() => setActiveTab("users")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "users" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            👤 Manajemen Akun
          </button>
          {/* <button onClick={() => setActiveTab("payment")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "payment" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            💳 Metode Pembayaran
          </button> */}
          <button onClick={() => setActiveTab("products")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "products" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            🛒 Products
          </button>

          {/* Dropdown Menu */}
          <button onClick={toggleSettingDropdown} className="w-full text-left flex items-center justify-between py-2 px-4 rounded hover:bg-gray-700">
            ⚙ Setting
            {/* <span>{isSettingOpen ? ▲ : ▼}</span> */}
          </button>
          {isSettingOpen && (
            <div className="ml-4 space-y-2">
              <button onClick={() => setActiveTab("kreasis")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "kreasis" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                🎨 Kreasi
              </button>
              <button onClick={() => setActiveTab("tips")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "tips" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                📖 Tips
              </button>
              <button onClick={() => setActiveTab("galeri")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "galeri" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                🖼 Galeri
              </button>
            </div>
          )}

          <button onClick={() => setActiveTab("order")} className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "order" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
            📦 Order
          </button>
          <button
            onClick={() => navigate("/home")}
            className={`w-full text-left flex items-center py-2 px-4 rounded ${activeTab === "home" ? "bg-gray-700" : "hover:bg-gray-700"}`}
          >
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
            {/* Tombol menu hanya terlihat pada tampilan sm */}
              <button
                className="sm:block lg:hidden p-2 hover:bg-gray-100 rounded"
                onClick={toggleSidebar}
              >
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

        <div className="overflow-auto h-[calc(100vh-64px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
