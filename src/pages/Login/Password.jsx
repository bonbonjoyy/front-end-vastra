import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios"; // Import axios

export default function Password() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to capture error messages
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // console.log("Data yang di-submit:", data);
    try {
      // Send the email to the API
      const response = await axios.put("https://back-end-vastra.vercel.app/api/users/forgotpassword", {
        email: data.email,
      });
      // If successful, show the email sent notification
      setIsEmailSent(true);
    } catch (error) {
      // Handle error
      setErrorMessage("Gagal mengirim email. Coba lagi nanti.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-white lg:mt-0">
      <div className="max-w-[1220px] mx-auto flex flex-col lg:flex-row w-full">
        <div className="flex-1 flex items-center justify-center sm:pr-2 md:pr-4 lg:pr-5 md:justify-end w-full md:mb-0 md:order-2 relative lg:justify-end overflow-hidden">
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
            className="text-[32px] font-helvetica ml-[85px] lg:ml-8 text-center font-bold text-black 
                      sm:ml-[22px] text-center 
                      md:text-[48px] 
                      lg:ml-[120px]"
          >
            PULIHKAN
            <br />
            KATA SANDI
          </h1>

          {/* Form Section */}
          <div className="w-full max-w-[330px] ml-[25px] lg:ml-[110px] sm:max-w-[360px] lg:max-w-[396px]">
            {isEmailSent ? (
              <div className="space-y-4 mb-36 lg:mb-0">
                <div className="bg-blue-500 p-4 text-white text-center rounded">
                  <p className="font-helvetica text-[14px] pb-2lg:pb-2">
                    Kami telah mengirimkan email yang berisi instruksi untuk
                  </p>
                  <p className="font-helvetica text-[14px] ">
                    mengatur ulang kata sandi Anda.
                  </p>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-32">
                <input
                  type="email"
                  {...register("email", { required: "Email wajib diisi" })}
                  placeholder="E-mail"
                  className="w-full h-9 px-4 font-helvetica text-[14px] text-black/50 border border-black/50"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-white text-black font-helvetica text-[12px] border border-black hover:bg-black hover:text-white transition-colors"
                >
                  Pulihkan
                </button>

                <div className="flex justify-center items-center gap-2 mt-4">
                  <span className="text-[12px] font-helvetica text-[#868686]">
                    Ingat kata sandi anda?
                  </span>
                  <Link
                    to="/login"
                    className="text-[12px] font-helvetica text-[#1E1BCF]"
                  >
                    Kembali ke Masuk
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
