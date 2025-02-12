// src/pages/Login/Masuk.jsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from 'react-toastify'; // Impor ToastContainer dan toast
import 'react-toastify/dist/ReactToastify.css'; // Impor CSS untuk toast

export default function Masuk() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    console.log("Data yang dikirim:", data); // Tambahkan log ini
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        kata_sandi: data.kata_sandi, // Menggunakan kata_sandi
      });
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
  
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Menangani kesalahan dari backend
      if (error.response) {
        console.error("Response data:", error.response.data); // Tambahkan log ini
        toast.error(error.response.data.message || "Email atau Kata Sandi salah");
      } else {
        toast.error("Terjadi kesalahan jaringan");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Gagal login dengan Google");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white lg:mt-0">
      <div className="max-w-[1220px] mx-auto flex flex-col lg:flex-row w-full">
        <div className="flex-1 flex items-center justify-center sm:pr-2 md:pr-4 lg:pr-5 md:justify-end w-full mb-4 md:mb-0 md:order-2 relative lg:justify-end overflow-hidden">
          <img
            src="asset/image/login.svg"
            alt="Login illustration"
            className="w-[180px] sm:w-[180px] sm:mt-4 sm:h-auto
                      md:w-1/2 md:h-auto
                      lg:w-[68.5%] lg:mr-24 lg:h-auto lg:mt-0
                      object-contain transition-all duration-300"
          />
          <div className="absolute inset-0 mt-[100px] lg:mt-[203px] bg-gradient-to-b from-transparent to-white/53" />
        </div>

        <div
          className="flex flex-col items-start gap-6 w-full px-4 
                    sm:items-center sm:mt-4 sm:pl-4 
                    md:w-[50%] md:px-8 md:order-1 
                    lg:mt-[70px] lg:pl-[2px]"
        >
          <h1
            className="text-[32px] font-helvetica ml-[135px] text-center font-bold text-black 
                      sm:ml-[22px] text-center 
                      md:text-[48px] lg:ml-[120px]"
          >
            MASUK
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-start mb-8 lg:mb-0 gap-4 w-full 
                      sm:pl-4 
                      md:w-[396px] md:ml-[120px] 
                      lg:w-[396px] lg:ml-[120px]"
          >
            <input
              type="email"
              {...register("email", { required: "Email wajib diisi" })}
              placeholder="E-mail"
              className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("kata_sandi", { required: "Kata Sandi wajib diisi" })}
                placeholder="Kata Sandi"
                className="w-full h-9 px-4 font-helvetica text-[14px] text-black border border-black/50"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  width="24"
                  height="24"
                />
              </button>
            </div>
            {errors.kata_sandi && (
              <p className="text-red-500 text-sm">{errors.kata_sandi.message}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-white text-black font-helvetica text-[12px] border border-black hover:bg-black hover:text-white transition-colors"
            >
              Masuk
            </button>

            <div className="flex justify-start">
              <Link
                to="/lupa-password"
                className="text-[12px] font-helvetica text-[#1E1BCF]"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            <div className="flex flex-col items-center w-full">
              <p className="text-[12px] font-helvetica text-[#868686]">
                Atau masuk dengan
              </p>
            </div>

            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => {
                    const googleLoginButton = document.querySelector(
                      '[role="button"][aria-labelledby="button-label"]'
                    );
                    if (googleLoginButton) {
                      googleLoginButton.click();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-black font-helvetica text-[14px] border border-black hover:bg-black hover:text-white transition-colors"
                >
                  <Icon icon="flat-color-icons:google" width="22" height="22" />
                  Masuk Dengan Google
                </button>
                <div className="hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      // console.log("Login Failed");
                    }}
                    useOneTap
                  />
                </div>
              </div>
            </GoogleOAuthProvider>

            <div className="flex justify-center items-center gap-1 mt-2 mb-12 lg:mb-0">
              <span className="text-[12px] font-helvetica text-[#868686]">
                Belum punya akun?
              </span>
              <Link to="/register" className="text-[12px] font-helvetica text-[#1E1BCF]">
                Daftar
              </Link>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}