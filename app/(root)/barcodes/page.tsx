"use client"
import React from 'react'
import Title from "@/components/shared/Title";
import Barcode from 'react-barcode';

const page = () => {
  return (
    <>
       <div className='-mt-12'>
          <Title text={"Barcodes"} />
        </div>
        <div>
          <Barcode value="W1-L12-04" />
        </div>
      
    </>
  )
}

export default page
