import React from 'react';
import ProductCard from '../../components/ProductCard/Productcard';
import SectionDivider from '../../components/SectionDivider/SectionDivider';


function Formal() {
  const products = [
    { image: '/asset/image/fullbody.svg', text: 'FullBody Suit', link: '/Fullbodysuit' },
    { image: '/asset/image/casualformal.svg', text: 'Casual' ,link: '/Casuall' },
    { image: '/asset/image/smartc.svg', text: 'Smart Casual' , link: '/SmartCasuall'},
    { image: '/asset/image/preppy.svg', text: 'Preppy Cardigan' , link: '/PreppyCardigan' },
    { image: '/asset/image/preppysweater.svg', text: 'Preppy Sweater' ,link: '/PreppySweater' },
    { image: '/asset/image/batik.svg', text: 'Batik', link:'/Batik' },
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
        <section className="flex flex-col md:flex-row justify-between border-b border-solid border-black items-center py-6 px-4 sm:px-10 md:px-20">
          <div className="text-left w-full md:w-1/2 mb-2 sm:mb-2 md:mb-5 lg:mb-8">
            <p className="text-3xl leading-relaxed
                          sm:text-3xl lg:leading-relaxed
                          md:text-5xl md:mx-[65px] lg:leading-relaxed
                          lg:text-5xl lg:mx-[65px] lg:leading-relaxed
                          ">
              Setelan Formal</p>
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

export default Formal;
