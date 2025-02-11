import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../SupabaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productData, setProductData] = useState({
    id: null,
    nama_product: "",
    harga: "",
    stok: "",
    deskripsi: "",
    image: null,
    kategori: "",
  });
  const [originalProductData, setOriginalProductData] = useState({});
  const [loading, setLoading] = useState(false); // State untuk loading
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true); // Set loading menjadi true saat memulai pengambilan data
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mengambil data produk");
    } finally {
      setLoading(false); // Set loading menjadi false setelah selesai
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let isDataChanged = false;
    const updatedData = {};
  
    // Cek perubahan pada data (kecuali gambar)
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "image" && value !== originalProductData[key]) {
        isDataChanged = true;
      }
      if (key !== "image") {
        updatedData[key] = value;
      }
    });
  
    // Jika gambar baru diunggah
    if (productData.image instanceof File) {
      isDataChanged = true;
      const file = productData.image;
  
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
      const url = productData.id ? `/api/products/${productData.id}` : "/api/products/";
      const method = productData.id ? "patch" : "post";
  
      await api[method](url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      toast.success("Product berhasil disimpan");
      fetchProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error.response);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({
        ...productData,
        image: file, // Simpan file untuk diunggah saat submit
      });
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductData({
      id: product.id,
      nama_product: product.nama_product || "",
      harga: product.harga || "",
      stok: product.stok || "",
      deskripsi: product.deskripsi || "",
      kategori: product.kategori || "",
      image: product.image || null,
    });
    setOriginalProductData({
      id: product.id,
      nama_product: product.nama_product || "",
      harga: product.harga || "",
      stok: product.stok || "",
      deskripsi: product.deskripsi || "",
      kategori: product.kategori || "",
      image: product.image || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchProducts();
      toast.success("Produk berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menghapus produk");
    }
  };


  const resetForm = () => {
    setProductData({
      nama_product: "",
      harga: "",
      stok: "",
      deskripsi: "",
      image: null,
      kategori: "",
    });
    setOriginalProductData({});
  };

  const filteredProducts = products.filter(product => {
    return (
      product.nama_product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.id && product.id.toString().includes(searchQuery))
    );
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <ToastContainer />
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Produk</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Produk
          </button>
          <div className="flex items-center ml-auto">
            <input
              type="text"
              placeholder="Cari Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-black rounded p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {loading ? ( // Tampilkan loading saat data sedang dimuat
          <div className="flex justify-center items-centerh-full">
            <div className="loader">Loading...</div> {/* Ganti dengan spinner atau animasi loading sesuai kebutuhan */}
          </div>
        ) : (
          ["Kaos", "Jaket", "Aksesoris"].map((kategori) => {
            const kategoriProduk = filteredProducts.filter((product) => product.kategori === kategori);
            if (kategoriProduk.length === 0) return null; // Jika kategori kosong, tidak perlu ditampilkan

            return (
              <div key={kategori} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{kategori}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {kategoriProduk.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border shadow rounded-lg p-2 max-w-xs"
                    >
                      <div className="w-full h-[300px] mb-4 overflow-hidden rounded-lg">
                        <img
                          src={product.image}
                          alt="Product"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg">{product.nama_product}</h3>
                        <p className="text-sm text-gray-500">{product.kategori}</p>
                        <p className="text-lg font-semibold mt-2">Rp {product.harga}</p>
                        <p className="text-sm text-gray-700">Stok: {product.stok}</p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedProduct ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={productData.image instanceof File
                        ? URL.createObjectURL(productData.image)
                        : productData.image
                      }
                      alt="Product"
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
                  <label className="block">Nama Produk</label>
                  <input
                    type="text"
                    value={productData.nama_product}
                    onChange={(e) => setProductData({ ...productData, nama_product: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block">Deskripsi</label>
                  <textarea
                    value={productData.deskripsi}
                    onChange={(e) => setProductData({ ...productData, deskripsi: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block">Harga</label>
                    <input
                      type="number"
                      value={productData.harga}
                      onChange={(e) => setProductData({ ...productData, harga: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block">Stok</label>
                    <input
                      type="number"
                      value={productData.stok}
                      onChange={(e) => setProductData({ ...productData, stok: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block">Kategori</label>
                  <select
                    value={productData.kategori}
                    onChange={(e) => setProductData({ ...productData, kategori: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Kaos">Kaos</option>
                    <option value="Jaket">Jaket</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Simpan
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

export default ProductManagement;