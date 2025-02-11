import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../SupabaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GaleriManagement = () => {
  const [galeri, setGaleri] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGaleri, setSelectedGaleri] = useState(null);
  const [galeriData, setGaleriData] = useState({
    title: "",
    kategori: "",
    sub_kategori: "",
    image: null,
  });
  const [originalGaleriData, setOriginalGaleriData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/galeris/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGaleri(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mengambil data Galeri");
    }
  };

  const handleToggleCategory = (kategori) => {
    setOpenCategories((prev) => ({
      ...prev,
      [kategori]: !prev[kategori], // Toggle status terbuka/tutup
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let isDataChanged = false;
    const updatedData = {};
  
    // Cek perubahan pada data (kecuali gambar)
    Object.entries(galeriData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalGaleriData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        updatedData[key] = value;
      }
    });
  
    // Jika gambar baru diunggah
    if (galeriData.image instanceof File) {
      isDataChanged = true;
      const file = galeriData.image;
  
      // Validasi file
      if (!file.type.match(/image.*/)) {
        toast.error("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Maksimal 5MB
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
  
      try {
        const token = localStorage.getItem("token");
  
        // Mengambil nama file dan ekstensi file
        const fileParts = file.name.split('.').filter(Boolean);
        const fileName = fileParts.slice(0, -1).join('.');  // Nama file tanpa ekstensi
        const fileType = fileParts.slice(-1)[0];  // Ekstensi file
        const timestamp = new Date().toISOString();  // Membuat timestamp untuk unik
        const newFileName = `${fileName} ${timestamp}.${fileType}`;  // Membuat nama file baru
  
        // Upload gambar ke Supabase
        const publicUrl = await uploadToSupabase(newFileName, file);
        // console.log('Public URL:', publicUrl);
  
        // Update galeriData dengan URL gambar yang baru
        updatedData.image = publicUrl; // URL dari Supabase
      } catch (error) {
        toast.error("Gagal mengunggah gambar ke Supabase");
        console.error("Error response:", error.response);
        return;
      }
    }
  
    if (!isDataChanged) {
      toast.info("Tidak ada perubahan data.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const url = galeriData.id ? `/api/galeris/${galeriData.id}` : "/api/galeris/";
      const method = galeriData.id ? "patch" : "post";
  
      await api[method](url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Galeri berhasil disimpan");
      fetchGaleri();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  }; 
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGaleriData({
        ...galeriData,
        image: file, // Simpan file untuk diunggah saat submit
      });
    }
  };

  const handleEdit = (galeri) => {
    setSelectedGaleri(galeri);
    setGaleriData({
      id: galeri.id,
      title: galeri.title || "",
      kategori: galeri.kategori || "",
      sub_kategori: galeri.sub_kategori || "",
      image: galeri.image || null,
    });
    setOriginalGaleriData({
      id: galeri.id,
      title: galeri.title || "",
      kategori: galeri.kategori || "",
      sub_kategori: galeri.sub_kategori || "",
      image: galeri.image || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus galeri?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/galeris/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchGaleri();
      toast.success("Galeri berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menghapus galeri");
    }
  };


  const resetForm = () => {
    setGaleriData({
      title: "",
      kategori: "",
      sub_kategori: "",
      image: null,
      id: null,
    });
    setOriginalGaleriData({});
  };

  // Fungsi untuk memfilter galeri berdasarkan pencarian
  const filteredGaleri = galeri.filter((item) => {
    const { title, kategori, sub_kategori } = item;
    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub_kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderGaleriCategory = (kategori) => {
    const filteredGaleriByCategory = filteredGaleri.filter((galeri) => galeri.kategori === kategori);

    // Mengelompokkan galeri berdasarkan subkategori
    const groupedBySubCategory = filteredGaleriByCategory.reduce((acc, galeri) => {
      const subKategori = galeri.sub_kategori || "Tidak Ada"; // Gunakan "Tidak Ada" jika subkategori tidak ada
      if (!acc[subKategori]) {
        acc[subKategori] = [];
      }
      acc[subKategori].push(galeri);
      return acc;
    }, {});

    return (
      <div key={kategori} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{kategori}</h2>
        {Object.keys(groupedBySubCategory).map((subKategori) => (
          <div key={subKategori} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{subKategori}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedBySubCategory[subKategori].length === 0 ? (
                <p className="text-xs text-gray-500">Tidak ada galeri untuk subkategori ini.</p>
              ) : (
                groupedBySubCategory[subKategori].map((galeri) => (
                  <div key={galeri.id} className="bg-white border shadow rounded-lg p-2 max-w-xs">
                    <div className="w-full h-[400px] mb-4 overflow-hidden rounded-lg">
                      <img
                        src={galeri.image}
                        alt="Galeri"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-semibold">Title: {galeri.title || "Tidak Ada"}</p>
                      <p className="text-sm"><b>Kategori</b>: {galeri.kategori || "Tidak Ada"}</p>
                      <p className="text-sm"><b>Sub Kategori</b>: {galeri.sub_kategori || "Tidak Ada"}</p>
                    </div>
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => handleEdit(galeri)}
                        className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(galeri.id)}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ToastContainer />
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Galeri</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Galeri
          </button>
          <div className="flex items-center ml-auto">
            <input
              type="text"
              placeholder="Cari berdasarkan title, kategori, atau sub kategori"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {["Harian", "Formal", "Khusus"].map((kategori) => renderGaleriCategory(kategori))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedGaleri ? "Edit Galeri" : "Tambah Galeri"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        galeriData.image instanceof File
                          ? URL.createObjectURL(galeriData.image)
                          : galeriData.image
                      }
                      alt="Galeri"
                      className="w-full h-full object-cover"
                    />
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-sm mb-1">Title</label>
                  <input
                    type="text"
                    value={galeriData.title}
                    onChange={(e) =>
                      setGaleriData({ ...galeriData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-sm mb-1">Kategori</label>
                  <select
                    value={galeriData.kategori || ""}
                    onChange={(e) => setGaleriData({ ...galeriData, kategori: e.target.value, sub_kategori: "" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="Harian">Harian</option>
                    <option value="Formal">Formal</option>
                    <option value="Khusus">Khusus</option>
                  </select>
                </div>

                {["Harian", "Formal", "Khusus"].map((kategori) => {
                  if (galeriData.kategori === kategori) {
                    return (
                      <div key={kategori}>
                        <label className="block font-medium text-sm mb-1">Sub Kategori</label>
                        <select
                          value={galeriData.sub_kategori || ""}
                          onChange={(e) => setGaleriData({ ...galeriData, sub_kategori: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="">Tidak Ada</option>
                          {kategori === "Harian" && [
                            "Denim", "Casual", "SmartCasual", "Tropical", "Flannel", "Sporty", "Polo", "Streetwear",
                          ].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                          {kategori === "Formal" && [
                            "FullBody", "Casual", "SmartCasual", "PreppyCardigan", "PreppySweater", "Batik"].map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          {kategori === "Khusus" && [
                            "ArabicDress", "Vintage", "Hiker", "TheRoyal", "HipHop", "Military", "WinterCoat", "Biker",
                          ].map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                })}

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {selectedGaleri ? "Update Galeri" : "Tambah Galeri"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriManagement;