import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../../utils/api";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState(null); // State for notification
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setNotification({ message: "Password tidak cocok!", type: "error" });
      return;
    }

    try {
      console.log('Submitting new password:', newPassword);
      await api.put("/api/users/resetpassword", {
        token: token,
        newPassword: newPassword,
      });
      setNotification({ message: "Password berhasil diperbarui!", type: "success" });

      // Hide notification after 5 seconds and navigate to login
      setTimeout(() => {
        setNotification(null);
        navigate("/login");
      }, 5000);
    } catch (error) {
      setNotification({ message: error.response?.data?.message || "Gagal mereset password", type: "error" });
      setTimeout(() => setNotification(null), 5000); // Hide notification after 5 seconds
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white mt-8 lg:mt-0">
      <div className="max-w-[1220px] mx-auto flex flex-col lg:flex-row w-full">
        {/* Bagian Gambar */}
        <div className="flex-1 flex items-center justify-center sm:pr-2 md:pr-4 lg:pr-5 md:justify-end w-full mb-4 md:mb-0 md:order-2 relative lg:justify-end overflow-hidden">
          <img
            src="/asset/image/login.svg"
            alt="Login illustration"
            className="w-[180px] sm:w-[180px] sm:mt-4 sm:h-auto
                    md:w-1/2 md:h-auto
                    lg:w-[68.5%] lg:mr-24 lg:h-auto lg:mt-0
                    object-contain transition-all duration-300"
          />
          <div className="absolute inset-0 mt-[100px] lg:mt-[203px] bg-gradient-to-b from-transparent to-white/53" />
        </div>

        {/* Form Reset Password */}
        <div className="flex flex-col items-start gap-6 w-full px-4 mb-40 lg:mb-0 sm:items-center sm:mt-4 sm:pl-4 md:w-[50%] md:px-8 md:order-1 lg:mt-[70px] lg:pl-[2px]">
          <h1 className="font-helvetica ml-[40px] font-bold text-black text-center text-[32px] md:text-[48px]
                        lg:ml-[123px] lg:mb-0">
            RESET PASSWORD
          </h1>

          {/* Notification */}
          {notification && (
            <div className={`w-full p-4 mb-4 ml-32 mt-12 text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} rounded flex justify-center items-center`}>
              {notification.message}
            </div>
          )}

          {/* Form hanya ditampilkan jika tidak ada notifikasi */}
          {!notification && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start gap-4 w-full sm:pl-4 md:w-[396px] md:ml-[120px] lg:w-[396px] lg:ml-[120px]"
            >
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="24"
                    height="24"
                  />
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password Baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="24"
                    height="24"
                  />
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black font-helvetica text-[12px] border border-black hover:bg-black hover:text-white transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
