import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heading, Img, useCart } from "../../components";
import { getProductById } from "../../api/product";
import Header from "../../components/Header/Header";
import { ToastContainer, toast } from 'react-toastify'; // Impor ToastContainer dan toast
import 'react-toastify/dist/ReactToastify.css'; // Impor CSS untuk toast

export default function Content() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  // Menggunakan useCart hook
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(id);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return null;

  const productImages = product.images || [product.image];

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => {
      const newValue = prev + increment;
      return newValue > 0 ? newValue : 1;
    });
  };

  const handleAddToCart = () => {
    if (category !== "aksesoris" && !selectedSize) {
      alert("Silahkan pilih ukuran terlebih dahulu");
      return;
    }

    // Membuat objek produk untuk ditambahkan ke keranjang
    const productToAdd = {
      id: id,
      title: product.nama_product,
      price: parseFloat(product.harga.replace(/[^0-9]/g, "")), // Mengubah string harga ke number
      size: category === "aksesoris" ? "ONE SIZE" : selectedSize,
      image: product.image,
      quantity: quantity,
      category: category,
    };

    // Menambahkan ke keranjang
    addToCart(productToAdd);
    toast.success("Produk berhasil ditambahkan ke keranjang!");

    // Reset quantity ke 1 setelah menambahkan ke keranjang
    setQuantity(1);
    if (category !== "aksesoris") {
      setSelectedSize("");
    }
  };

  const getImageStyle = () => {
    return "w-full h-full object-cover object-center";
  };

  return (
    <>
      <Header className="bg-white-a700" />
      <div className="pb-[27px] 
              sm:pb-[127px]
              md:px-[120px] md:pt-[74px] md:pb-[127px]
              lg:px-[120px] lg:pt-[54px] lg:pb-[127px]">
        <div className="border border-black flex flex-col sm:flex-col md:flex-row lg:flex-row h-full mx-[20px] mt-5 md:mt-0 lg:mt-0">

          {/* Main Image Container */}
          <div className="w-full sm:w-full md:w-[548px] lg:w-[548px] relative sm:mb-[32px] md:mb-0 lg:mb-0 border-b sm:border-b md:border-r lg:border-r border-black overflow-hidden">
            <div className="relative">
              <img
                src={product.image}
                alt={product.nama_product}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Section - Product Info */}
          <div className="w-full sm:w-full md:flex-1 lg:flex-1 relative">
            <div className="p-[20px] sm:p-[20px] md:pl-[95px] md:pt-[129px] md:pr-[129px] lg:pl-[95px] lg:pt-[65px] lg:pr-[129px]">

              {/* Title and Price */}
              <div className="mb-[32px]">
                <Heading
                  as="h1"
                  className="text-[25px] sm:text-[25px] md:text-[40px] lg:text-[40px] font-bold font-['Helvetica'] whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {product.nama_product}
                </Heading>
                <div className="text-[19px] sm:text-[19px] md:text-[40px] lg:text-[40px] text-[#868686] font-['Helvetica']">
                  Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
                </div>
              </div>

              {/* Size Selection - Only show for non-accessories */}
              {category !== "aksesoris" && (
                <div className="mb-[32px] sm:mb-[72px] md:mb-[72px] lg:mb-[22px]">
                  <div className="text-md sm:text-md md:text-md lg:text-lg font-['Helvetica'] mb-[15px]">
                    Ukuran
                  </div>
                  <div className="flex border border-black inline-flex">
                    {(product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) ? (
                      product.sizes.map((size, index) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-[35px] h-[30px] px-2
                                sm:w-[30px] h-[30px]
                                md:w-[42px] h-[42px]
                                lg:w-[42px] h-[42px]
                                font-['Helvetica'] transition-colors
                      ${selectedSize === size
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-black hover:text-white"
                            }
                      ${index !== 0 ? "border-l border-black" : ""}`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      ['S', 'M', 'L', 'XL'].map((size, index) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-[35px] h-[30px] px-2
                                sm:w-[30px] h-[30px]
                                md:w-[42px] h-[42px]
                                lg:w-[42px] h-[42px]
                                font-['Helvetica'] transition-colors
                      ${selectedSize === size
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-black hover:text-white"
                            }
                      ${index !== 0 ? "border-l border-black" : ""}`}
                        >
                          {size}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="mb-[30px] sm:mb-[72px] md:mb-[72px] lg:mb-[82px]">
                <div className="text-md sm:text-md md:text-md lg:text-lg font-['Helvetica'] mb-[15px]">
                  Jumlah
                </div>
                <div className="flex border border-black inline-flex">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-[35px] h-[30px] px-2
                        sm:w-[35px] h-[30px]
                        md:w-[42px] h-[42px]
                        lg:w-[42px] h-[45px]
                        font-['Helvetica'] hover:bg-black hover:text-white transition-colors font-bold">
                    -
                  </button>
                  <div className="w-[30px] h-[30px] px-4
                          sm:w-[42px] h-[42px]
                          md:w-[42px] h-[42px]
                          lg:w-[42px] h-[45px]
                          border-l border-r border-black flex items-center justify-center font-['Helvetica']">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-[35px] h-[30px] px-2
                          sm:w-[px] h-[42px]
                          md:w-[42px] h-[42px]
                          lg:w-[42px] h-[45px]
                          font-['Helvetica'] hover:bg-black hover:text-white transition-colors font-bold">
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-end sm:justify-end md:justify-start lg:justify-start">
                <button
                  onClick={handleAddToCart}
                  className="w-[120px] h-[45px] bg-black text-white font-bold 
                            sm:w-[120px] sm:h-[45px] 
                            md:w-[120px] md:h-[45px] 
                            lg:w-[120px] lg:h-[45px] 
                            font-['Helvetica'] hover:bg-white hover:text-black border border-black transition-colors">
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
