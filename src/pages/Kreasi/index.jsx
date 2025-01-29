import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Content from "./Content"
import Banner from "./banner";
import React from "react";

export default function Kreasi() {
    return (
        <>
        <title>Kreasi</title>

        <div className="w-full border border-solid border-blk bg-white-a700">
            <Header className="bg-white-a700" />
            <div>
                <Banner />
                <Content />
            </div>
            <Footer
            className="mt-[92px]"
            />
        </div>
        </>
    )
}