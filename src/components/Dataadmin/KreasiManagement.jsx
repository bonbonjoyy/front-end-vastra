import { useState, useEffect } from "react";
import api from "../../utils/api";

const KreasiManagement = () => {
  const [kreasis, setKreasis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedKreasi, setSelectedKreasi] = useState(null);
  const [kreasiData, setKreasiData] = useState({
    kulit: "",
    badan: "",
    image: null,
  });
  const [originalKreasiData, setOriginalKreasiData] = useState({}); // Add state for original data

  useEffect(() => {
    fetchKreasis();
  }, []);

  const fetchKreasis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/kreasis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKreasis(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data kreasi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    let isDataChanged = false;
  
    Object.entries(kreasiData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalKreasiData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        data.append(key, value);
      }
    });
  
    // Handle image change properly
    if (kreasiData.image instanceof File) {
      isDataChanged = true;
      data.append("image", kreasiData.image);
    } else if (kreasiData.image === null && originalKreasiData.image) {
      // Remove image if it's set to null
      data.append("image", null);
    }
  
    if (!isDataChanged) {
      alert("Tidak ada perubahan data.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const url = kreasiData.id
        ? `/api/kreasis/${kreasiData.id}`
        : "/api/kreasis";
      const method = kreasiData.id ? "patch" : "post";
  
      await api[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Kreasi berhasil disimpan");
      fetchKreasis();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      alert(error.response?.data?.message || "Gagal menyimpan data");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kreasi?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/kreasis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchKreasis();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus kreasi");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/image.*/)) {
        alert("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
  
      // Hapus URL lama sebelum membuat yang baru
      if (kreasiData.image instanceof File) {
        URL.revokeObjectURL(kreasiData.image);
      }
  
      setKreasiData((prevState) => ({ ...prevState, image: file }));
    }
  };

  const resetForm = () => {
    setKreasiData({
      kulit: "",
      badan: "",
      image: null,
    });
    setOriginalKreasiData({});
  };

  return (
    <div className="flex flex-col h-full bg-white">
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
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kreasis.map((kreasi) => (
            <div key={kreasi.id} className="bg-white border shadow rounded-lg p-4">
              <div className="w-full h-100 mb-4 overflow-hidden rounded-lg">
                <img
                  src={
                    kreasi.image
                      ? `http://localhost:3333${kreasi.image}`
                      : "/asset/image/kreasiplaceholder.svg"
                  }
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
                          ? `http://localhost:3333${kreasiData.image}`
                          : "/asset/image/kreasiplaceholder.svg"
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
