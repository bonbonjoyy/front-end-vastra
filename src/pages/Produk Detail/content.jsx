import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heading, Img, useCart } from "../../components";
import { getProductById } from "../../api/product";
import Header from "../../components/Header/Header";

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
    alert("Produk berhasil ditambahkan ke keranjang!");

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
                  lg:px-[120px] lg:pt-[54px] lg:pb-[127px]
                  ">
        <div className="border border-black flex flex-col h-full
                        sm:flex-col sm:h-[313px]
                        md:flex-row md:h-[713px]
                        lg:flex-row lg:h-[613px]">
          {/* Layout for Accessories, Jackets, and T-shirts */}
          {category === "aksesoris" ? (
            // Layout for Accessories
            <div className="w-[548px] relative border-r border-black overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={
                    product.image
                      ? `http://localhost:3333${product.image}`
                      : "/asset/image/productplaceholder.svg"
                  }
                  alt={product.nama_product}
                  className={getImageStyle()}
                />
              </div>
            </div>
          ) : (
            // Layout for Jackets and T-shirts
            <div className="flex flex-wrap sm:flex-wrap md:flex-nowrap lg:flex-nowrap gap-0">
              {/* Main Image Container */}
              <div className="w-[548px] relative border-r border-black overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={
                    product.image
                      ? `http://localhost:3333${product.image}`
                      : "/asset/image/productplaceholder.svg"
                  }
                  alt={product.nama_product}
                  className={getImageStyle()}
                />
              </div>
            </div>

            </div>
          )}

          {/* Right Section - Product Info */}
          <div className="flex-1 relative">
            <div className="pl-[20px] pt-[30px] pr-[9px] h-full
                            sm:pl-[20px] sm:pt-[30px] sm:pr-[9px] sm:h-full
                            md:pl-[95px] md:pt-[129px] md:pr-[129px] md:h-full
                            lg:pl-[95px] lg:pt-[65px] lg:pr-[129px] lg:h-full">
              {/* Title and Price */}
              <div className="mb-[32px]">
                <Heading
                  as="h1"
                  className="text-[25px] mb-[8px] 
                            sm:text-[25px] mb-[10px] 
                            md:text-[40px] mb-[25px] 
                            lg:text-[40px] mb-[25px] 
                            font-bold font-['Helvetica'] whitespace-nowrap overflow-hidden text-ellipsis">
                  {product.nama_product}
                </Heading>
                <div className="text-[19px] sm:text-[19px] md:text-[40px] lg:text-[40px] text-[#868686] font-['Helvetica']">
                  Rp {new Intl.NumberFormat('id-ID').format(product.harga)}
                </div>
              </div>

              {/* Size Selection - Only show for non-accessories */}
              {category !== "aksesoris" && (
                <div className="mb-[32px] pl-[192px] sm:mb-[72px] md:mb-[72px] lg:mb-[22px] lg:pl-0">
                <div className="text-md mb-[15px]
                                sm:text-md 
                                md:text-md 
                                lg:text-lg 
                                font-['Helvetica']">
                  Ukuran
                </div>
                <div className="flex border border-black inline-flex">
                  {/* Jika product.sizes tidak ada, gunakan ukuran default */}
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
                    // Menampilkan ukuran default jika sizes tidak ada
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
              <div className="mb-[70px] pl-[230px] sm:mb-[72px] md:mb-[72px] lg:mb-[82px] lg:pl-0">
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
