import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../../components/SupabaseConfig";
import { ToastContainer, toast } from 'react-toastify'; // Impor ToastContainer dan toast
import 'react-toastify/dist/ReactToastify.css'; // Impor CSS untuk toast
import { confirmAlert } from 'react-confirm-alert'; // Impor confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Impor CSS untuk confirmAlert

const KreasiManagement = () => {
  const [kreasis, setKreasis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedKreasi, setSelectedKreasi] = useState(null);
  const [kreasiData, setKreasiData] = useState({
    id: null,
    kulit: "",
    badan: "",
    image: null,
  });
  const [originalKreasiData, setOriginalKreasiData] = useState({}); // Add state for original data
  const [searchQuery, setSearchQuery] = useState(""); // State untuk menyimpan query pencarian

  useEffect(() => {
    fetchKreasis();
  }, []);

  const fetchKreasis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/kreasis/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKreasis(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mengambil data kreasi"); // Ganti alert dengan toast
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let isDataChanged = false;
    const updatedData = {};
  
    // Cek perubahan pada data (kecuali gambar)
    Object.entries(kreasiData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalKreasiData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        updatedData[key] = value;
      }
    });
  
    // Jika gambar baru diunggah
    if (kreasiData.image instanceof File) {
      isDataChanged = true;
      const file = kreasiData.image;
  
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
  
        // Update updatedData dengan URL gambar yang baru
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
      const url = kreasiData.id ? `/api/kreasis/${kreasiData.id}` : "/api/kreasis/";
      const method = kreasiData.id ? "patch" : "post";
  
      await api[method](url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Kreasi berhasil disimpan");
      fetchKreasis();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKreasiData({
        ...kreasiData,
        image: file, // Simpan file untuk diunggah saat submit
      });
    }
  };

  const handleEdit = (kreasi) => {
    setSelectedKreasi(kreasi);
    setKreasiData({
      id: kreasi.id,
      kulit: kreasi.kulit || "",
      badan: kreasi.badan || "",
      image: kreasi.image || null,
    });
    setOriginalKreasiData({
      id: kreasi.id,
      kulit: kreasi.kulit || "",
      badan: kreasi.badan || "",
      image: kreasi.image || null,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Konfirmasi Hapus',
      message: 'Yakin ingin menghapus Data?',
      buttons: [
        {
          label: 'Ya',
          onClick: async () => {
            try {
              const token = localStorage.getItem("token");
              await api.delete(`/api/kreasis/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await fetchKreasis();
              toast.success("Data berhasil dihapus"); // Ganti alert dengan toast
            } catch (error) {
              console.error("Error:", error);
              toast.error("Gagal menghapus Data"); // Ganti alert dengan toast
            }
          }
        },
        {
          label: 'Tidak',
          onClick: () => toast.info("Penghapusan dibatalkan") // Notifikasi }
        }
      ]
    });
  };

  const resetForm = () => {
    setKreasiData({
      kulit: "",
      badan: "",
      image: null,
      id: null, // Reset ID ke null
    });
    setOriginalKreasiData({});
  };

  // Fungsi untuk memfilter kreasi berdasarkan pencarian
  const filteredKreasis = kreasis.filter(kreasi => {
    const query = searchQuery.toLowerCase();
    return (
      kreasi.id.toString().includes(query) || // Mencari berdasarkan ID
      kreasi.kulit.toLowerCase().includes(query) || // Mencari berdasarkan kulit
      kreasi.badan.toLowerCase().includes(query) // Mencari berdasarkan badan
    );
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <ToastContainer /> {/* Tambahkan ToastContainer di sini */}
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Kreasi</h1>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Kreasi
          </button>
          <div className="flex items-center ml-auto">
            <input
              type="text"
              placeholder="Cari berdasarkan ID, Kulit, atau Badan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-black rounded-md p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKreasis.map((kreasi) => (
            <div key={kreasi.id} className="bg-white border shadow rounded-lg p-4">
              <div className="w-full h-100 mb-4 overflow-hidden rounded-lg">
                <img
                  src={kreasi.image}
                  alt="Kreasi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Warna Kulit: {kreasi.kulit || "Tidak Ada"}</h3>
                <p className="text-sm text-gray-600">Bentuk Badan: {kreasi.badan || "Tidak Ada"}</p>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(kreasi)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(kreasi.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedKreasi ? "Edit Kreasi" : "Tambah Kreasi"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        kreasiData.image instanceof File
                          ? URL.createObjectURL(kreasiData.image)
                          : kreasiData.image
                      }
                      alt="Kreasi"
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
                  <label className="block font-medium text-sm mb-1">Warna Kulit</label>
                  <select
                    value={kreasiData.kulit || ""}
                    onChange={(e) => setKreasiData({ ...kreasiData, kulit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="Terang">Terang</option>
                    <option value="Sawo">Sawo Matang</option>
                    <option value="Gelap">Gelap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-sm mb-1">Bentuk Badan</label>
                  <select
                    value={kreasiData.badan || ""}
                    onChange={(e) => setKreasiData({ ...kreasiData, badan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tidak Ada</option>
                    <option value="Kurus">Kurus</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Gemuk">Gemuk</option>
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
                    {selectedKreasi ? "Update Kreasi" : "Tambah Kreasi"}
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

export default KreasiManagement;