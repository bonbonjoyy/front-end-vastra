//C:\Users\Fadhlan\Downloads\Vastra-main\frontend\src\components\Dataadmin\UserManagement.jsx

import { useState, useEffect } from "react";
import api from "../../utils/api";
import supabase from "../SupabaseConfig";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    username: "",
    password: "",
    role: "user",
    profile_image: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data pengguna");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    if (
      !formData.username ||
      !formData.email ||
      (!selectedUser && !formData.password)
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
    if (!selectedUser) {
      data.append("kata_sandi", formData.password);
    }

    // Append foto jika ada
    if (formData.profile_image instanceof File) {
      data.append("profile_image", formData.profile_image);
    }

    try {
      let response;
      if (selectedUser) {
        response = await api.patch(`/api/users/${selectedUser.id}`, data);
      } else {
        response = await api.post("/api/users", data);
      }

      if (response.data) {
        await fetchUsers();
        setShowForm(false);
        setSelectedUser(null);
        resetForm();
        alert(
          selectedUser
            ? "Data berhasil diperbarui"
            : "Pengguna baru berhasil ditambahkan"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
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
      alert("Gagal menghapus pengguna");
    }
  };

  const handlePhotoUpload = (e) => {
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
      setFormData({ ...formData, profile_image: file });
    }
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
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Akun</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="rounded-lg border shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Foto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Nama Lengkap
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Terakhir Login
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => handleViewPhoto(user)}
                    >
                      <img
                        src={
                          user.profile_image
                            ? `http://localhost:3333${user.profile_image}`
                            : "/asset/image/userprofil.svg"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.nama_lengkap || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === "admin" ? "Admin" : "Pengguna"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {selectedUser ? "Edit Pengguna" : "Tambah Pengguna"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <img
                      src={
                        formData.profile_image instanceof File
                          ? URL.createObjectURL(formData.profile_image)
                          : formData.profile_image
                          ? `http://localhost:3333${formData.profile_image}`
                          : "/asset/image/userprofil.svg"
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
                  onChange={(e) =>
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
                  disabled={selectedUser?.is_google_account}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedUser?.is_google_account ? "bg-gray-100" : ""
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
                  disabled={selectedUser?.is_google_account}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedUser?.is_google_account ? "bg-gray-100" : ""
                  }`}
                />

                {!selectedUser && (
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
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {selectedUser ? "Perbarui" : "Tambah"}
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
                src={
                  selectedPhoto
                    ? `http://localhost:3333${selectedPhoto}`
                    : "/asset/image/userprofil.svg"
                }
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
