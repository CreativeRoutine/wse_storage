"use server"
import React from "react";
import Title from "@/components/shared/Title";
import DisplayPallets from "@/components/shared/DisplayPallets";

const Storage = async () => {

    return (
      <>
        <Title text="Storage" />
        
        <div className="py-4 px-8 mb-2 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
          <div className="w-full text-lg">
            Pallets without printers.
          </div>
        </div>
  
        <DisplayPallets />
        
      </>
    );
};

export default Storage;
