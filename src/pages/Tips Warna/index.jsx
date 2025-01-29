import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Content from "./content";
import Banner from "./banner";
import Kategori from "./kategori";
import React from "react";

export default function TipsWarna() {
    return (
        <>
        <title>Tips</title>

        <div className="w-full border border-solid border-blk bg-white-a700">
            <Header className="bg-white-a700" />
            <div>
                <Banner />
                <Kategori />
                <Content />
            </div>
            <Footer
            className="mt-[92px]"
            />
        </div>
        </>
    )
}