import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../../components/SupabaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Impor confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Impor CSS untuk confirmAlert

const TipsManagement = () => {
  const [tips, setTips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTips, setSelectedTips] = useState(null);
  const [tipsData, setTipsData] = useState({
    id: null,
    judul: "",
    kategori: "",
    deskripsi: "",
    urutan: "",
    image: null,
  });
  const [originalTipsData, setOriginalTipsData] = useState({});

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/tips/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTips(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mengambil data Tips");
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
  
    // Jika gambar baru diunggah
    if (tipsData.image instanceof File) {
      isDataChanged = true;
      const file = tipsData.image;
  
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
        const imageUrl = await uploadToSupabase(newFileName, file);
        // console.log("Uploaded image URL:", imageUrl);
  
        // Update updatedData dengan URL gambar yang baru
        updatedData.image = imageUrl; // URL dari Supabase
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
      const url = tipsData.id ? `/api/tips/${tipsData.id}` : "/api/tips/";
      const method = tipsData.id ? "patch" : "post";
  
      await api[method](url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Tips berhasil disimpan");
      fetchTips();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTipsData({
        ...tipsData,
        image: file, // Simpan file untuk diunggah saat submit
      });
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
      image: tips.image || null,
    });
    setOriginalTipsData({
      id: tips.id,
      judul: tips.judul || "",
      kategori: tips.kategori || "",
      deskripsi: tips.deskripsi || "",
      urutan: tips.urutan || "",
      image: tips.image || null,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Konfirmasi Hapus',
      message: 'Yakin ingin menghapus tips?',
      buttons: [
        {
          label: 'Ya',
          onClick: async () => {
            try {
              const token = localStorage.getItem("token");
              await api.delete(`/api/tips/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await fetchTips();
              toast.success("Tips berhasil dihapus");
            } catch (error) {
              console.error("Error:", error);
              toast.error("Gagal menghapus tips");
            }
          }
        },
        {
          label: 'Tidak',
          onClick: () => toast.info("Penghapusan dibatalkan") // Notifikasi
        }
      ]
    });
  };


  // Reset Form
  const resetForm = () => {
    setTipsData({
      judul: "",
      kategori: "",
      deskripsi: "",
      urutan: "",
      image: null,
      id: null,
    });
    setOriginalTipsData({});
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ToastContainer />
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
        {["Bahan", "Warna", "Aksesoris"].map((kategori) => {
          const filteredTips = tips.filter((tip) => tip.kategori === kategori);

          return (
            <div key={kategori} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{kategori}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.length === 0 ? (
                  <p className="text-sm text-gray-500">Tidak ada tips untuk kategori ini.</p>
                ) : (
                  filteredTips.map((tip) => (
                    <div key={tip.id} className="bg-white border shadow rounded-lg p-4">
                      <div className="w-full h-100 mb-4 overflow-hidden rounded-lg">
                        <img
                          src={tip.image}
                          alt="Tips"
                          className="w-full h-[200px] object-cover"
                        />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">Judul: {tip.judul || "Tidak Ada"}</h3>
                        <p className="text-sm font-semibold">Kategori: {tip.kategori || "Tidak Ada"}</p>
                        <p className="text-sm"><b> Deskripsi</b>: {tip.deskripsi || "Tidak Ada"}</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            handleEdit(tip);
                            sessionStorage.setItem("id_tip", tip.id);
                          }}
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
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        tipsData.image instanceof File
                          ? URL.createObjectURL(tipsData.image)
                          : tipsData.image
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