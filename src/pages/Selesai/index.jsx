import React from "react";
import { useNavigate } from "react-router-dom";
import { Text, Button, Heading } from "../../components";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Selesai = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex w-full flex-col bg-white-a700">
        <Header className="self-stretch" />

        <div className="mx-[23px] flex items-center justify-center
                        sm:mx-[23px]
                        md:mx-[123px]
                        lg:mt-0 mx-[123px]">
          <div className="max-w-2xl w-full">
            <div className="bg-white p-12 text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto border-2 border-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <div className="mb-8">
                <Heading
                  as="h1"
                  className="text-[36px] font-bold mb-6 text-black"
                >
                  Pesanan Berhasil di Buat!
                </Heading>

                <Text className="text-[18px] mb-0 text-black">
                  Terima kasih telah berbelanja di Vastra.
                  <br />
                  Silahkan lanjutkan pembayaran di Pesanan Saya.
                </Text>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 flex flex-col items-center w-full max-w-md mx-auto">
                <div
                  className="w-full"
                  onClick={() => navigate("/Order")}
                >
                  <div className="bg-black p-2 mb-2 cursor-pointer">
                    <Text className="text-[16px] font-bold text-white text-center block">
                      Bayar
                    </Text>
                  </div>
                </div>

                <div className="w-full" onClick={() => navigate("/home")}>
                  <div className="bg-black p-2 cursor-pointer">
                    <Text className="text-[16px] font-bold text-white text-center block">
                      Kembali ke Beranda
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Selesai;
