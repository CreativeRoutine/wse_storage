"use server"
import React from "react";
import Title from "@/components/shared/Title";
import { getPallets } from "@/lib/actions/pallet.action";


import DisplayPallets from "@/components/shared/DisplayPallets";

const Storage = async () => {

  const resultPallets = await getPallets({})
  const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))
  
  return (
    <>
      <Title text="Storage" />
      
      <div className="py-4 px-8 mb-2 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
        <div className="w-full text-lg">
          Pallets without printers.
        </div>
      </div>

      <DisplayPallets pallets={pallets}/>
      
    </>
  );
};

export default Storage;
