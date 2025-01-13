"use client"
import React from 'react'
import Title from "@/components/shared/Title";
import Barcode from 'react-barcode';

const page = () => {
  return (
    <>
       <div className='-mt-12 print:hidden'>
          <Title text={"Barcodes"} />
        </div>

      <div className='print:block'>
        <div className='mb-1'>
          <Barcode value="W3-L15-01" />
        </div>
        <div className='mb-1'>
          <Barcode value="W3-L15-02" />
        </div>
        <div className='mb-1'>
          <Barcode value="W3-L15-03" />
        </div>
        <div className='mb-1'>
          <Barcode value="W3-L15-04" />
        </div>
        <div className='mb-1'>
          <Barcode value="W3-L15-05" />
        </div>

      </div>
      
    </>
  )
}

export default page
