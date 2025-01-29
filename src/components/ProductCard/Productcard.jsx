import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ image, text, link }) {
  return (
    <div
      className="relative group border border-black shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
    >
      <div className="w-auto h-[240px]
                      sm:w-auto sm:h-[280px]
                      md:w-auto md:h-[320px]
                      lg:w-auto lg:h-[320px]">
        <img
          src={image}  // Directly use the image prop
          alt={text}
          className="object-contain w-full max-h-full"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-white pt-2 pb-2 pl-2 flex justify-between items-center
                  sm:pt-2 sm:pb-2 sm:pl-4
                  md:pt-2 md:pb-2 md:pl-4
                  lg:pt-2 lg:pb-2 lg:pl-4"
        style={{ width: '100%' }}
      >
        {link ? (
          <Link to={link}>
            <button className="px-1 py-1.5 bg-white border-2 border-black text-sm text-black hover:bg-black hover:text-white transition duration-300
                              sm:px-1 sm:py-1.5 sm:text-base
                              md:px-4 md:py-2 md:text-base
                              lg:px-2 lg:py-2 lg:text-md ">
              {text}
            </button>
          </Link>
        ) : (
          <button className="px-3 py-1.5 bg-white border-2 border-black text-sm text-black hover:bg-black hover:text-white transition duration-300
                            sm:px-4 sm:py-2 sm:text-base
                            md:px-4 md:py-2 md:text-base
                            lg:px-6 lg:py-3 lg:text-lg ">
            {text}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
