import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heading, Img, BannerProduk } from "../../components";
import { getAllProducts } from "../../api/product";

const ProductCard = ({ image, title, price, onClick, category }) => {
  const getImagePosition = () => {
    const titleLower = title.toLowerCase();
    if (category === "jaket") {
      if (titleLower.includes("topi")) return "object-[center_30%]";
      if (titleLower.includes("kalung")) return "object-[center_20%]";
      if (titleLower.includes("sabuk")) return "object-[center_40%]";
      if (titleLower.includes("dompet")) return "object-[center_45%]";
      return "object-[center_40%]";
    }
    return "object-[center_25%]";
  };

  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative border border-black h-[400px]">
        <div className="relative h-[340px] overflow-hidden">
          <div className="absolute inset-0">
            <Img
              src={image}
              alt={title}
              className={`w-full h-full object-cover ${getImagePosition()}`}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-black">
          <Heading as="h3" className="text-l font-bold text-black text-center truncate">
            {title}
          </Heading>
          <Heading as="p" className="text-m font-normal text-gray-500 text-center">
            {price}
          </Heading>
        </div>
      </div>
    </div>
  );
};

export default function Content() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.pathname.split("/").pop(); // Mengambil kategori dari URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil produk berdasarkan kategori
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(category); // Ambil produk berdasarkan kategori
        setProducts(data);
      } catch (err) {
        setError(err.message); // Tangani error jika ada masalah dalam pengambilan data
      } finally {
        setLoading(false); // Set loading menjadi false setelah data selesai diambil
      }
    };
    fetchProducts();
  }, [category]);

  // Fungsi untuk menangani klik pada produk
  const handleProductClick = (id) => {
    // Navigasi ke halaman detail produk berdasarkan ID dan kategori
    navigate(`/Produk-Kami/${category}/${id}`);
  };

  if (loading) {
    return (
      <p className="flex justify-center items-center h-screen m-0">
        Sedang Memuat Data...
      </p>
    );
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-[120px]">
      <div className="mt-12 md:mt-[100px] lg:mt-[125px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-20 sm:pt-2 md:pt-0 lg:pt-0 gap-x-5 sm:gap-x-5 md:gap-x-8 lg:gap-x-10 gap-y-6 sm:gap-y-6 md:gap-y-10 lg:gap-y-[75px]">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard
                image={product.image}
                title={product.nama_product}
                price={`Rp ${new Intl.NumberFormat('id-ID').format(product.harga)}`}
                category={category}
                onClick={() => handleProductClick(product.id)} // Panggil fungsi handleProductClick saat klik
              />
            </div>
          ))}
        </div>
        <BannerProduk />
      </div>
    </div>
  );
}
