"use client";

import React from 'react'
import Title from "@/components/shared/Title";
import Barcode from 'react-barcode';
import CreateBarcodes from '@/components/shared/barcodes/CreateBarcodes';

const Barcodes = () => {

  


  return (
    <>
      <div className='-mt-12 print:hidden'>
        <Title text={"Barcodes"} />
      </div>

      <div className='-mt-4 bg-dark-600 rounded-xl  p-4 text-white flex flex-row gap-4'>
        
        {/* LEFT COLUMN */}
        <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl border border-dark-350 shadow-lg">
          <CreateBarcodes />
        </div>

        {/* RIGHT COLUMN */}
        <div className='print:block bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl border border-dark-350 shadow-lg'>
          <div className='mb-1'>
            <Barcode value="W3-L15-01" />
          </div>
        </div>
      </div>



      
    </>
  )
}

export default Barcodes
