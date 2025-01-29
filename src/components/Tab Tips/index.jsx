import React from "react";
import { Text } from './..';

export default function TabTips({ textContent = "Memilih Bahan", ...props }) {
    return (
        <div
            {...props}
            className={`${props.className} flex justify-center items-center w-[32%] md:w-full px-14 py-[118px] md:p-5 border border-solid`}
        >
            <Text as="p" className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-normal text-white-a700">
                {textContent}
            </Text>
        </div>
    );
}
