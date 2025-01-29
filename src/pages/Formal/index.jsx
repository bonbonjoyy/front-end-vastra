import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Content from "./content";


import React from "react";

export default function Formal() {
  return (
    <>
      <title>Formal</title>

      <div className="w-full border border-solid border-blk bg-white-a700">
        <Header className="bg-white-a700" />
        <div>
          <Content />
        </div>
        <Footer className="mt-[92px]" />
      </div>
    </>
  );
}
