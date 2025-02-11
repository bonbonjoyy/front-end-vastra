import React from 'react';
import ProductCard from '../../components/ProductCard/Productcard';
import SectionDivider from '../../components/SectionDivider/SectionDivider';

function Harian() {
  const products = [
    { image: '/asset/image/dod.svg', text: 'Denim on Denim', link: '/Denim' },
    { image: '/asset/image/casual.svg', text: 'Casual', link: '/Casual' },
    { image: '/asset/image/smartcasual.svg', text: 'Smart Casual', link: '/Smartcasual' },
    { image: '/asset/image/tropical.svg', text: 'Tropical', link: '/Tropical' },
    { image: '/asset/image/flanel.svg', text: 'Flannel', link: '/Flannel' },
    { image: '/asset/image/sporty.svg', text: 'Sporty', link: '/Sporty' },
    { image: '/asset/image/polo.svg', text: 'Polo', link: '/Polo' },
    { image: '/asset/image/streetwear.svg', text: 'Streetwear', link: '/Streetwear' }
  ];

  return (
    <div className="font-sans text-gray-900">
      <div className="relative">
        {/* Gambar Header */}
        <img
          src="/asset/image/Header.svg"
          alt="Header Image"
          className="w-full h-[239px] object-cover brightness-50"
        />
        <div className="absolute left-[145px] top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold space-y-4">
          <p>GALERI VASTRA</p>
        </div>
      </div>

      <SectionDivider />

      <main>
        {/* Deskripsi */}
        <section className="flex flex-col md:flex-row justify-between border-b border-solid border-black items-center py-6 px-4 sm:px-10 md:px-20">
          <div className="text-left w-full md:w-1/2 mb-2 sm:mb-2 md:mb-5 lg:mb-8">
            <p className="text-3xl mx-[65px] leading-relaxed
                          sm:text-3xl sm:mx-[65px] lg:leading-relaxed
                          md:text-5xl md:mx-[65px] lg:leading-relaxed
                          lg:text-5xl lg:mx-[65px] lg:leading-relaxed
                          ">
              Setelan Harian</p>
          </div>
          <div className="text-left w-full md:w-1/2 mx-[80px]">
            <p className="text-justify leading-relaxed">
            Didesain untuk kenyamanan dan kemudahan bergerak dalam kegiatan sehari-hari, seperti hangout, 
            kuliah, atau kegiatan santai lainnya. Biasanya terdiri dari pakaian kasual seperti jeans, 
            chinos, kaos, atau kemeja santai. Jenis setelan ini cenderung ringan dan mudah dipadukan dengan 
            sneakers atau sepatu kasual.
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* Grid Produk */}
        <section className="grid grid-cols-2 gap-4 px-4 pt-8
                            sm:grid-cols-3 sm:gap-6 sm:px-10
                            md:grid-cols-4 md:gap-10 md:px-20 
                            lg:grid-cols-4 lg:gap-8 lg:px-[148px] lg:pt-20">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default Harian;
