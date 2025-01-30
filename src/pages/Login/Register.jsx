import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api, { setAuthToken } from "../../utils/api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // Ini mendeklarasikan state isRegistered
  const [isFormVisible, setIsFormVisible] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        alert("Password tidak cocok!");
        return;
      }

      const response = await api.post("/auth/register", {
        username: data.username,
        email: data.email,
        kata_sandi: data.password, // Ganti 'password' dengan 'kata_sandi'
      });

      if (response.data.token) {
        setAuthToken(response.data.token);

        // Tampilkan notifikasi terlebih dahulu
        setShowNotification(true);
        setIsRegistered(true);
        setIsFormVisible(false);
      }
    } catch (error) {
      console.error("Register error:", error);
      alert(error.response?.data?.message || "Gagal membuat akun");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center min-h-screen bg-white mt-8 lg:mt-0">
      <div className="max-w-[1220px] mx-auto flex flex-col lg:flex-row w-full">
        {/* Bagian Gambar */}
        <div className="flex-1 flex items-center justify-center sm:pr-2 md:pr-4 lg:pr-5 md:justify-end w-full mb-4 md:mb-0 md:order-2 relative lg:justify-end overflow-hidden">
          <img
            src="asset/image/login.svg"
            alt="Login illustration"
            className="w-[180px] sm:w-[180px] sm:mt-4 sm:h-auto
                    md:w-1/2 md:h-auto
                    lg:w-[68.5%] lg:mr-24 lg:h-auto lg:mt-0
                    object-contain transition-all duration-300"
          />
          <div
            className="absolute inset-0 mt-[100px] lg:mt-[203px] 
                    bg-gradient-to-b from-transparent to-white/53"
          />
        </div>

        {/* Bagian Form atau Notifikasi */}
        <div
          className="flex flex-col items-start gap-6 w-full px-4 
                  sm:items-center sm:mt-4 sm:pl-4 
                  md:w-[50%] md:px-8 md:order-1 
                  lg:mt-[70px] lg:pl-[2px]"
        >
          <h1
            className="text-[32px] font-helvetica ml-[98px] font-bold text-black 
                    sm:ml-[22px] text-center 
                    md:text-[48px] 
                    lg:ml-[120px]"
          >
            DAFTAR
          </h1>

          {isFormVisible ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-4 w-full 
                    sm:pl-4 
                    md:w-[396px] md:ml-[120px] 
                    lg:w-[396px] lg:ml-[120px]"
            >
              {/* Input Email */}
              <input
                type="email"
                {...register("email", { required: "Email wajib diisi" })}
                placeholder="E-mail"
                className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}

              {/* Input Username */}
              <input
                type="text"
                {...register("username", { required: "Username wajib diisi" })}
                placeholder="Username"
                className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}

              {/* Input Kata Sandi */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Kata Sandi wajib diisi",
                  })}
                  placeholder="Kata Sandi"
                  className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="24"
                    height="24"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}

              {/* Input Konfirmasi Kata Sandi */}
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Konfirmasi kata sandi wajib diisi",
                    validate: (value) =>
                      value === password || "Kata sandi tidak cocok",
                  })}
                  placeholder="Masukkan Ulang Kata Sandi"
                  className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="24"
                    height="24"
                  />
                </button>
              </div>
              {/* Menampilkan error jika ada */}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* Tombol Daftar */}
              <button
                type="submit"
                className="w-full py-2.5 bg-white text-black font-helvetica text-[12px] border border-black hover:bg-black hover:text-white transition-colors"
              >
                Daftar
              </button>

              {/* Link Daftar */}
              <div className="flex justify-center items-center gap-1 mt-2 mb-12 lg:mb-0">
                <span className="text-[12px] font-helvetica text-[#868686]">
                  Sudah punya akun?
                </span>
                <Link
                  to="/login"
                  className="text-[12px] font-helvetica text-[#1E1BCF]"
                >
                  Masuk
                </Link>
              </div>
            </form>
          ) : (
            // Menampilkan notifikasi setelah form disembunyikan
            <div className="ml-5 w-[300px]
                          sm:ml-24 sm:w-[300px]
                          md:ml-24 md:w-[300px]
                          lg:ml-24 lg:w-[300px]">
              {/* Notifikasi bahwa akun berhasil dibuat */}
              <div className="flex flex-col items-center font-bold mt-2 py-6 border bg-white border-2 border-solid border-black text-black
                          sm:mt-2 sm:py-8
                          md:mt-2 md:py-8
                          lg:mt-2 lg:py-8 lg:">
                <p>Akun berhasil dibuat!</p>
              </div>

              {/* Teks "Ingat kata sandi Anda? Masuk" dengan link hanya pada kata "Masuk" */}
              <div className="flex flex-row items-center mt-2 ml-[70px] mb-40
                          sm:mt-2 sm:ml-16 sm:mb-24
                          md:mt-2 md:ml-16 md:mb-0
                          lg:mt-2 lg:ml-16 lg:mb-0">
                <p className="mr-2 text-gray-600 md:mr-1 lg:mr-1">Lanjutkan ke</p>
                <button
                  onClick={handleLoginRedirect}
                  className="text-blue-500 text-[14px] font-semibold"
                >
                  Masuk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
