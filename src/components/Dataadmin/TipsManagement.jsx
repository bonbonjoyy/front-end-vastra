import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../../components/SupabaseConfig";

const TipsManagement = () => {
  const [tips, setTips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTips, setSelectedTips] = useState(null);
  const [tipsData, setTipsData] = useState({
    judul: "",
    kategori: "",
    deskripsi: "",
    urutan: "",
    image: null,
  });
  const [originalTipsData, setOriginalTipsData] = useState({}); // Add state for original data

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/tips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTips(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data Tips");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let isDataChanged = false;
    const updatedData = {};
  
    // Cek perubahan pada data (kecuali gambar)
    Object.entries(tipsData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalTipsData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        updatedData[key] = value;
      }
    });
  
    // Jika gambar berubah (URL baru dari Supabase)
    if (tipsData.image !== originalTipsData.image) {
      isDataChanged = true;
      updatedData.image = tipsData.image; // URL dari Supabase
    }
  
    if (!isDataChanged) {
      alert("Tidak ada perubahan data.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const url = tipsData.id ? `/api/tips/${tipsData.id}` : "/api/tips";
      const method = tipsData.id ? "patch" : "post";
  
      await api[method](url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Data dikirim sebagai JSON
        },
      });
  
      alert("Tips berhasil disimpan");
      fetchTips();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleEdit = (tips) => {
    setSelectedTips(tips);
    setTipsData({
      id: tips.id,
      judul: tips.judul || "",
      kategori: tips.kategori || "",
      deskripsi: tips.deskripsi || "",
      urutan: tips.urutan || "",
      image: tipsData.image || null,
    });
    setOriginalTipsData({
      id: tips.id,
      judul: tips.judul || "",
      kategori: tips.kategori || "",
      deskripsi: tips.deskripsi || "",
      urutan: tips.urutan || "",
      image: tipsData.image || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus tips?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/tips/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchTips();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus tips");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
  
    if (file) {
      if (!file.type.match(/image.*/)) {
        alert("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Maksimal 5MB
        alert("Ukuran file maksimal 5MB");
        return;
      }
  
      try {

        console.log("Mulai proses upload...");
        // Mengambil nama file dan ekstensi file
        const fileParts = file.name.split('.').filter(Boolean);
        const fileName = fileParts.slice(0, -1).join('.');  // Nama file tanpa ekstensi
        const fileType = fileParts.slice(-1)[0];  // Ekstensi file
        const timestamp = new Date().toISOString();  // Membuat timestamp untuk unik
        const newFileName = `${fileName} ${timestamp}.${fileType}`;  // Membuat nama file baru

        console.log("Nama file baru:", newFileName);
  
        // Upload file ke Supabase dan dapatkan URL publik
        const publicUrl = await uploadToSupabase(newFileName, file);

        console.log("URL yang didapat dari Supabase:", publicUrl);

  
        // Hapus URL lama sebelum menyimpan yang baru
        if (tipsData.image instanceof File) {
          console.log("Menghapus URL lama:", tipsData.image);
          URL.revokeObjectURL(tipsData.image);
        }
  
        // Simpan URL publik ke state
        setTipsData((prevState) => ({
          ...prevState,
          image: publicUrl, // Simpan URL gambar, bukan file
        }));
        
        console.log("State tipsData setelah update:", tipsData);
  
        alert("Gambar berhasil diupload!");
      } catch (error) {
        alert("Gagal mengunggah gambar ke Supabase");
        console.error(error);
      }
    }
  };
  
  // Reset Form
  const resetForm = () => {
    setTipsData({
      judul: "",
      kategori: "",
      deskripsi: "",
      urutan: "",
      image: null, // Reset image ke null
    });
    setOriginalTipsData({});
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Tips</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Tips
          </button>
        </div>
      </div>
  
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {/* Kelompokkan berdasarkan kategori */}
        {["Bahan", "Warna", "Aksesoris"].map((kategori) => {
          // Filter tips berdasarkan kategori
          const filteredTips = tips.filter((tip) => tip.kategori === kategori);
  
          return (
            <div key={kategori} className="mb-8">
              {/* Header Kategori */}
              <h2 className="text-2xl font-bold mb-4">{kategori}</h2>
  
              {/* Grid untuk menampilkan tips dalam kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada tips untuk kategori ini.</p>
                ) : (
                  filteredTips.map((tip) => (
                    <div key={tip.id} className="bg-white border shadow rounded-lg p-4">
                      <div className="w-full h-100 mb-4 overflow-hidden rounded-lg">
                        <img
                          src={
                            tip.image
                              ? `https://back-end-vastra.vercel.app${tip.image}`
                              : "/asset/image/tipsplaceholder.svg"
                          }
                          alt="Tips"
                          className="w-full h-[200px] object-cover"
                        />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">Judul: {tip.judul || "Tidak Ada"}</h3>
                        <p className="text-sm font-semibold">Kategori: {tip.kategori || "Tidak Ada"}</p>
                        <p className="text-sm"><b>Deskripsi</b>: {tip.deskripsi || "Tidak Ada"}</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(tip)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tip.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
  
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedTips ? "Edit Tips" : "Tambah Tips"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload Section */}
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        tipsData.image instanceof File
                          ? URL.createObjectURL(tipsData.image)
                          : tipsData.image
                          ? `https://back-end-vastra.vercel.app${tipsData.image}`
                          : "/asset/image/tipsplaceholder.svg"
                      }
                      alt="Tips"
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
  
                {/* Title Field */}
                <div>
                  <label className="block font-medium text-sm mb-1">Judul Tips</label>
                  <input
                    type="text"
                    value={tipsData.judul}
                    onChange={(e) =>
                      setTipsData({ ...tipsData, judul: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
  
                {/* Category Dropdown */}
                <div>
                  <label className="block font-medium text-sm mb-1">Kategori</label>
                  <select
                    value={tipsData.kategori || ""}
                    onChange={(e) => setTipsData({ ...tipsData, kategori: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="Bahan">Bahan</option>
                    <option value="Warna">Warna</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                </div>
  
                {/* Description Field */}
                <div>
                  <label className="block font-medium text-sm mb-1">Deskripsi</label>
                  <textarea
                    value={tipsData.deskripsi || ""}
                    onChange={(e) => setTipsData({ ...tipsData, deskripsi: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
  
                <div>
                  <label className="block font-medium text-sm mb-1">Urutan Tampilan</label>
                  <select
                    value={tipsData.urutan || ""}
                    onChange={(e) => setTipsData({ ...tipsData, urutan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="header">Header</option>
                    <option value="body">Body</option>
                  </select>
                </div>
  
                {/* Action Buttons */}
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
                    {selectedTips ? "Update Tips" : "Tambah Tips"}
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

export default TipsManagement;
