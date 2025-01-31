import { useState, useEffect } from "react";
import api from "../../utils/api";

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

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/galeris", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGaleri(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data Galeri");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    let isDataChanged = false;
    let imageUrl = galeriData.image;

    Object.entries(galeriData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalGaleriData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        data.append(key, value);
      }
    });

    // Jika ada gambar baru, upload ke Supabase
    if (galeriData.image instanceof File) {
      isDataChanged = true;

      const file = galeriData.image;
      const fileParts = file.name.split('.').filter(Boolean);
      const fileName = fileParts.slice(0, -1).join('.');  // Nama file tanpa ekstensi
      const fileType = fileParts.slice(-1)[0];  // Ekstensi file
      const timestamp = new Date().toISOString();  // Timestamp unik
      const newFileName = `${fileName} ${timestamp}.${fileType}`;  // Nama file baru

      try {
        imageUrl = await uploadToSupabase(newFileName, file);
        data.append("image", imageUrl);
      } catch (error) {
        console.error("Gagal mengunggah gambar ke Supabase:", error);
        alert("Gagal mengunggah gambar");
        return;
      }
    } else if (galeriData.image === null && originalGaleriData.image) {
      data.append("image", null);
    }

    if (!isDataChanged) {
      alert("Tidak ada perubahan data.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = galeriData.id ? `/api/galeris/${galeriData.id}` : "/api/galeris";
      const method = galeriData.id ? "patch" : "post";

      await api[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Galeri berhasil disimpan");
      fetchGaleri();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      alert(error.response?.data?.message || "Gagal menyimpan data");
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
      titlei: galeri.title || "",
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
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghapus galeri");
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

      if (galeriData.image instanceof File) {
        URL.revokeObjectURL(galeriData.image);
      }

      setGaleriData((prevState) => ({ ...prevState, image: file }));
    }
  };

  const resetForm = () => {
    setGaleriData({
        title: "",
      kategori: "",
      sub_kategori: "",
      image: null,
    });
    setOriginalGaleriData({});
  };

  const renderGaleriCategory = (kategori) => {
    const filteredGaleri = galeri.filter((galeri) => galeri.kategori === kategori);

    return (
        <div key={kategori} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{kategori}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGaleri.length === 0 ? (
                <p className="text-xs text-gray-500">Tidak ada galeri untuk kategori ini.</p>
            ) : (
                filteredGaleri.map((galeri) => (
                    <div key={galeri.id} className="bg-white border shadow rounded-lg p-2 max-w-xs"> 
                    <div className="w-full h-[300px] mb-4 overflow-hidden rounded-lg">
                    <img
                        src={galeri.image ? `http://localhost:3333${galeri.image}` : "/asset/image/galeriplaceholder.svg"}
                        alt="Galeri"
                        className="w-full h-full object-contain" // Menggunakan object-contain untuk menjaga gambar tetap terlihat utuh
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
      );
      
  };

  return (
    <div className="flex flex-col h-full bg-white">
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
                          ? `http://localhost:3333${galeriData.image}`
                          : "/asset/image/galeriplaceholder.svg"
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
                            "FullBody", "Casual", "SmartCasual","PreppyCardigan","PreppySweater","Batik"].map((option) => (
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
