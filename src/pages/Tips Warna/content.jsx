import React, { Suspense, useEffect, useState } from "react";
import { Img, Heading, Text } from "../../components/";

export default function Content() {
    const [tipsData, setTipsData] = useState([]);
    const [headerTips, setHeaderTips] = useState([]);
    const [bodyTips, setBodyTips] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://back-end-vastra.vercel.app/api/tips");
                const data = await response.json();

                // Filter data with category "Warna"
                const filteredData = data.filter(tip => tip.kategori === "Warna");

                setTipsData(filteredData);

                const header = filteredData.filter(tip => tip.urutan === "header");
                const body = filteredData.filter(tip => tip.urutan === "body");

                setHeaderTips(header);
                setBodyTips(body);
            } catch (error) {
                console.error("Error fetching tips:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="mt-[93px] flex flex-col items-center sm:px-4 md:px-8 lg:px-[129px]">
            {/* Display Header Tips */}
            <div className="container-xs flex flex-col gap-12 sm:gap-16 md:gap-[72px] lg:gap-24 sm:px-4 md:px-5 lg:px-0">
                {headerTips.map((tip, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row items-center justify-between gap-7 sm:gap-8 mx-4 md:gap-10 border border-solid border-black bg-white-a700 mb-8 mt-8 sm:mb-8 md:mb-[66px] lg:mb-[66px] lg:mt-0 lg:mx-5"
                    >
                        {/* Gambar */}
                        <Img
                            src={tip.image}
                            alt={tip.judul}
                            className="max-w-[70%] sm:max-w-[80%] md:max-w-[50%] h-auto object-contain mb-4 md:mb-0 lg:mb-0"
                        />

                        {/* Teks dan LabelView */}
                        <div className="flex flex-col items-start gap-11 md:px-5 pl-4 mb-2 lg:pl-6 lg:mb-0 flex-grow">
                            {/* Elemen Teks */}
                            <div className="flex flex-col items-start gap-11">
                                <Heading as="h2" className="text-[44px] font-bold text-blk md:text-[44px] sm:text-[38px]">
                                    {tip.judul}
                                </Heading>
                                <Text as="p" className="w-[84%] text-[16px] font-normal leading-7 text-blk md:w-full">
                                    {tip.deskripsi}
                                </Text>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Display Body Tips */}
            <div className="mr-5 grid grid-cols-1 justify-center gap-6 lg:gap-16 md:mr-0 md:grid-cols-2 lg:grid-cols-2 px-5">
                <Suspense fallback={<div>Loading feed...</div>}>
                    {bodyTips.map((tip, index) => (
                        <div
                            key={index}
                            className="flex mx-auto flex-col items-center w-auto gap-5 md:gap-[54px] lg:gap-[72px] border border-black border-solid bg-white"
                        >
                            <div className="self-stretch w-full">
                                <Img
                                    src={tip.image}
                                    alt={tip.judul}
                                    className="h-auto w-full object-cover max-h-[250px] sm:max-h-[280px] md:max-h-[318px]"
                                />
                            </div>

                            <div className="flex flex-col items-start gap-5 lg:gap-11 self-stretch w-full px-8 sm:px-4 lg:px-[59px]">
                                <Heading
                                    size="subhead2"
                                    as="h3"
                                    className="text-[34px] font-bold text-blk sm:text-[28px]"
                                >
                                    {tip.judul}
                                </Heading>
                                <Text
                                    as="p"
                                    className="w-full text-[16px] font-normal leading-7 text-blk mb-[10px] sm:w-full sm:text-[15px] sm:leading-6 lg:text-[18px] lg:leading-7 lg:mb-[90px]"
                                >
                                    {tip.deskripsi}
                                </Text>
                            </div>
                        </div>
                    ))}
                </Suspense>
            </div>
        </div>
    );
}
