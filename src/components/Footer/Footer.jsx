import React from 'react';
import { Img, Heading, Text } from '..';
import { Link } from 'react-router-dom';

const Footer = ({ className, ...props }) => {
    // Fungsi untuk menggulir ke atas halaman
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer {...props} className={`${className} flex flex-col bg-black`}>
            <div className="h-[2px] w-full self-stretch" />
                <div className="py-[46px] mt-[-2px] relative flex justify-center self-stretch md:py-5">
                    <div className="container-xs w-full mb-1.5 flex flex-col justify-between mb-4
                                    sm:px-6
                                    md:px-5
                                    lg:flex-row lg:px-20">

                    {/* Tautan Penting */}
                    <div
                        className="w-[30%] flex flex-col items-start 
                                    sm:w-full pl-12 pr-8 pb-8
                                    md:w-[50%] md:pl-8 
                                    lg:pl-[65px]"
                        >
                        <ul>
                            <li>
                                <Text 
                                as="p" 
                                className="text-[20px] font-bold text-white mt-8 whitespace-nowrap 
                                            sm:text-[20px] 
                                            md:text-[16px]
                                            lg:text-[25px]"
                                >
                                Tautan Penting
                                </Text>
                            </li>
                            <li>
                            <Link to="/Harian" className="mt-[30px]" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Galeri
                                </Text>
                            </Link>
                            </li>
                            <li>
                            <Link to="/Tips-Bahan" className="mt-5" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Tips
                                </Text>
                            </Link>
                            </li>
                            <li>
                            <Link to="/kreasi" className="mt-5" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Kreasi
                                </Text>
                            </Link>
                            </li>
                            <li>
                            <Link to="/Produk-Kami/Kaos" className="mt-5" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Produk Kami
                                </Text>
                            </Link>
                            </li>
                        </ul>
                    </div>

                    <div
                        className="w-[30%] flex flex-col items-start 
                                    sm:w-full pl-12 
                                    md:w-[50%] md:pl-8 
                                    lg:pl-[10px]"
                        >
                        <ul>
                            <li>
                                <Text 
                                as="p" 
                                className="text-[20px] font-bold text-white mt-8 whitespace-nowrap
                                            sm:text-[20px]
                                            md:text-[16px] 
                                            lg:text-[25px]"
                                >
                                Temukan kami di
                                </Text>
                            </li>
                            <li>
                            <Link to="https://www.instagram.com/vastraid_/profilecard/?igsh=bW80NXNyMmIyenl3" className="mt-[30px]" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Instagram
                                </Text>
                            </Link>
                            </li>
                            <li>
                            <Link to="https://www.facebook.com/?locale=id_ID" className="mt-5" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Facebook
                                </Text>
                            </Link>
                            </li>
                            <li>
                            <a href="Akun Belum Ada" className="mt-5" onClick={scrollToTop}>
                                <Text 
                                as="p" 
                                className="font-normal text-white 
                                            sm:text-[14px] 
                                            md:text-[16px] 
                                            lg:text-[18px]"
                                >
                                Pinterest
                                </Text>
                            </a>
                            </li>
                        </ul>
                    </div>

                    {/* Logo */}
                    <div className="hidden lg:flex items-center justify-end w-[30%] sm:w-full pr-[86px]">
                        <img
                            src="/asset/image/logo-footer.svg"
                            alt="Footer Logo"
                            className="w-[294px] h-[152px] object-contain" 
                        />
                    </div>
                </div>
            </div>

            {/* Bagian untuk Copyright */}
            <div className="flex justify-center items-center py-[20px]">
                <Heading
                    as="h6"
                    className="text-[14px] font-bold text-white mt-[18px] mb-[10px] 
                    sm:text-[14px] sm:mt-[18px] sm:mb-[10px]
                    md:text-[14px] md:mt-[38px] md:mb-[10px]
                    lg:text-[18px] lg:mt-[38px] lg:mb-[10px]"
                >
                    Copyright © 20242020 All rights reserved
                </Heading>
            </div>
        </footer>
    );
};

export default Footer;