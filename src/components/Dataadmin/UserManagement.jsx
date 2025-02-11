import { useState, useEffect } from "react";
import api from "../../utils/api";
import { uploadToSupabase } from "../../components/SupabaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    username: "",
    password: "",
    role: "user",
    profile_image: null,
  });
  const [loading, setLoading] = useState(false); // State untuk loading

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter pengguna berdasarkan searchTerm
    const results = users.filter(user => {
      return (
        user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm) // Pencarian berdasarkan ID
      );
    });
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true); // Set loading menjadi true saat memulai pengambilan data
    try {
      const token = localStorage.getItem("token");
      // console.log("Token:", token);
      const response = await api.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setLoading(false); // Set loading menjadi false setelah selesai
    }
  };

  const handleSortByUsername = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      return a.username.localeCompare(b.username);
    });
    setFilteredUsers(sortedUsers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    if (
      !formData.username ||
      !formData.email ||
      (!selectedUser   && !formData.password)
    ) {
      alert("Username, email dan password (untuk user baru) wajib diisi!");
      return;
    }
  
    // Append data utama
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("nama_lengkap", formData.nama_lengkap);
    data.append("role", formData.role);
  
    // Append password jika tambah user baru
    if (!selectedUser  ) {
      data.append("kata_sandi", formData.password);
    }
  
    // Jika ada gambar baru, upload gambar
    if (formData.profile_image instanceof File) {
      try {
        const token = localStorage.getItem("token");
  
        // Mengambil nama file dan ekstensi file
        const fileParts = formData.profile_image.name.split('.').filter(Boolean);
        const fileName = fileParts.slice(0, -1).join('.');  // Nama file tanpa ekstensi
        const fileType = fileParts.slice(-1)[0];  // Ekstensi file
        const timestamp = new Date().toISOString();  // Membuat timestamp untuk unik
        const newFileName = `${fileName} ${timestamp}.${fileType}`;  // Membuat nama file baru
  
        // Upload gambar ke Supabase
        const publicUrl = await uploadToSupabase(newFileName, formData.profile_image);
        data.append("profile_image", publicUrl); // Tambahkan URL gambar ke data
      } catch (error) {
        toast.error("Gagal mengunggah gambar ke Supabase");
        console.error("Upload error:", error);
        return;
      }
    }
  
    try {
      let response;
      if (selectedUser  ) {
        response = await api.patch(`/api/users/${selectedUser  .id}`, data);
      } else {
        response = await api.post("/api/users", data);
      }
  
      if (response.data) {
        await fetchUsers();
        setShowForm(false);
        setSelectedUser  (null);
        resetForm();
        toast.success(
          selectedUser  
            ? "Data berhasil diperbarui"
            : "Pengguna baru berhasil ditambahkan"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/image.*/)) {
        toast.error("File harus berupa gambar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
  
      // Simpan file untuk diunggah saat submit
      setFormData((prevData) => ({
        ...prevData,
        profile_image: file, // Simpan file untuk diunggah saat submit
      }));
  
      toast.success('File siap diupload saat menyimpan data');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser (user);
    setFormData({
      nama_lengkap: user.nama_lengkap || "",
      email: user.email || "",
      username: user.username || "",
      password: "",
      role: user.role || "user",
      profile_image: user.profile_image || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menghapus pengguna");
    }
  };


  const handleViewPhoto = (user) => {
    setSelectedPhoto(user.profile_image); // Set URL foto yang dipilih
    setShowPhotoModal(true); // Tampilkan modal foto
  };

  const resetForm = () => {
    setFormData({
      nama_lengkap: "",
      email: "",
      username: "",
      password: "",
      role: "user",
      profile_image: null,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ToastContainer />
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold ml-12">Manajemen Akun </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 mr-12 rounded hover:bg-blue-600"
          >
            Tambah Pengguna
          </button>
          <button
            onClick={handleSortByUsername}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 mr-12 rounded hover:bg-green-600"
          >
            Urutkan Username A-Z
          </button>
          <div className="flex items-center ml-auto">
            <input
              type="text"
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 border-black rounded p-2"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {loading ? ( // Tampilkan loading saat data sedang dimuat
          <div className="flex justify-center items-center h-full">
            <div className="loader">Loading...</div> {/* Ganti dengan spinner atau animasi loading sesuai kebutuhan */}
          </div>
        ) : (
          <div className="rounded-lg border border-black shadow overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terakhir Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
                        onClick={() => handleViewPhoto(user)}>
                        <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 break-words">{user.nama_lengkap || "-"}</td>
                    <td className="px-6 py-4 break-words">{user.email}</td>
                    <td className="px-6 py-4 break-words">{user.username}</td>
                    <td className="px-6 py-4 break-words">
                      {user.role === "admin" ? "Admin" : "Pengguna"}
                    </td>
                    <td className="px-6 py-4 break-words">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedUser  ? "Edit Pengguna" : "Tambah Pengguna"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        formData.profile_image instanceof File
                          ? URL.createObjectURL(formData.profile_image)
                          : formData.profile_image
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      accept="image/*"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={formData.nama_lengkap}
                  onChange ={(e) =>
                    setFormData({ ...formData, nama_lengkap: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={selectedUser ?.is_google_account}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedUser ?.is_google_account ? "bg-gray-100" : ""
                    }`}
                />

                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={selectedUser ?.is_google_account}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedUser ?.is_google_account ? "bg-gray-100" : ""
                    }`}
                />

                {!selectedUser  && (
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Pengguna</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedUser (null);
                    }}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {selectedUser  ? "Perbarui" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-4">
              <img
                src={selectedPhoto}
                alt="Profile"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setShowPhotoModal(false)}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;