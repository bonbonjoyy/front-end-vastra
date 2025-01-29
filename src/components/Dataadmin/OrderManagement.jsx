import { useState, useEffect } from "react";
import api from "../../utils/api";

const OrderManagement = () => {
  const [orders, setOrder] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengambil data order");
    }
  };

  const getUsernameByUserId = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown User";
    }
  };
  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/orders/${orderId}/status`,
        { status: "Accepted" }, // Status harus ada di sini
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Status berhasil diubah menjadi Accepted");
      fetchOrders(); // Refresh data order
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengubah status order");
    }
  };
  const handleRejectOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/orders/${orderId}/status`,
        { status: "Rejected" }, // Status ditolak
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Status berhasil diubah menjadi Rejected");
      fetchOrders(); // Refresh data order
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal mengubah status order");
    }
  };
  

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  const handleDetailClick = (order) => {
    setSelectedOrder(order);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manajemen Order</h1>
        </div>
      </div>
  
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold">No Pesanan: {order.id}</h2>
              <p>Total: Rp {order.total.toLocaleString()}</p>
              <div
                className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 text-white text-center w-fit mt-2 ${
                  order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Accepted"
                    ? "bg-green-500"
                    : order.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                {order.status}
              </div>
              <div className="mt-4 flex gap-4 items-center">
                {order.image ? (
                  <button
                    onClick={() => handleImageClick(`http://localhost:3333${order.image}`)}
                    className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    <i className="fas fa-eye"></i> Bukti &nbsp;
                  </button>
                ) : (
                  // <p className="bg-yellow-200 text-yellow-800 px-2 rounded-md inline-block text-xs">
                  <p className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    Belum melakukan pembayaran
                  </p>
                )}

                <button
                  onClick={() => handleDetailClick(order)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                >
                  <i className="fas fa-eye"></i> Detail
                </button>

                {/* Tombol Konfirmasi hanya jika status "Waiting Confirm" dan ada gambar */}
                {order.status === "Waiting Confirm" && order.image && (
                  <button
                    onClick={() =>
                      window.confirm("Apakah Anda yakin ingin mengonfirmasi pesanan ini?") &&
                      handleConfirmOrder(order.id)
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    <i className="fas fa-check"></i> Konfirmasi
                  </button>
                )}

                {/* Tombol Tolak hanya jika status "Waiting Confirm" */}
                {order.status === "Waiting Confirm" && (
                  <button
                    onClick={() =>
                      window.confirm("Apakah Anda yakin ingin menolak pesanan ini?") &&
                      handleRejectOrder(order.id)
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    <i className="fas fa-times"></i> Tolak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

  
      {/* Modal Gambar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={handleCloseModal}
              className="text-gray-500 absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
            >
              X
            </button>
            <img
              src={selectedImage}
              alt="Bukti Pembayaran"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
  
      {/* Modal Detail Order */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button
                onClick={handleCloseForm}
                className="text-gray-500 absolute top-4 right-4"
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-4">
                {selectedOrder ? `Detail Order ${selectedOrder.id}` : ""}
              </h2>
              {/* Detail Pembeli */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Detail Pembeli:</h3>
                <table className="min-w-full mt-2 border-collapse">
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Email</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.email}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Nama Lengkap</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.nama_lengkap}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Alamat</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.alamat}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Kota</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.kota}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Kecamatan</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.kecamatan}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Kode Pos</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.kode_pos}</td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium">Phone</td>
                      <td className="border px-4 py-2">{selectedOrder?.shipping_details.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Detail Pesanan:</h3>
                <table className="min-w-full mt-2 border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 text-left">Id</th>
                      <th className="border px-4 py-2 text-left">Item</th>
                      <th className="border px-4 py-2 text-left">Harga</th>
                      <th className="border px-4 py-2 text-left">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder?.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{item.id}</td>
                        <td className="border px-4 py-2">{item.title} ({item.size})</td>
                        <td className="border px-4 py-2">Rp {item.price.toLocaleString()}</td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default OrderManagement;
