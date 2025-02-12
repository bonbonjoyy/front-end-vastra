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
      toast.error(
        error.response?.data?.message || "Email atau Kata Sandi salah"
      );
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
                      md:text-[48px] 
                      lg:ml-[120px]"
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
              className="w-full h-9 px-4 font-hel vetica border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("kata_sandi", { required: "Kata Sandi wajib diisi" })}
                placeholder="Kata Sandi"
                className="w-full h-9 px-4 font-helvetica border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </button>
            </div>
            {errors.kata_sandi && <span className="text-red-500">{errors.kata_sandi.message}</span>}

            <button
              type="submit"
              className="w-full h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Masuk
            </button>
          </form>

          <div className="flex flex-col items-center gap-4">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Lupa Kata Sandi?
            </Link>
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Gagal login dengan Google")}
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}