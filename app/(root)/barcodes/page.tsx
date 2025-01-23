import React from 'react'
import Title from "@/components/shared/Title";
import { getBarcodes } from '@/lib/actions/barcodes.action';
import DisplayPastBarcodes from '@/components/shared/barcodes/DisplayPastBarcodes';
import DisplayBarcodesWrapper from '@/components/shared/barcodes/DisplayBarcodesWrapper';


const Barcodes = async () => {

  const results = await getBarcodes();
  
  return (
    <>
      <div className='-mt-12 print:hidden'>
        <Title text={"Barcodes"} />
      </div>

      <div className='mt-4 bg-dark-600 rounded-xl p-4 text-white flex flex-col w-full'>
        <div className='print:hidden'>
          {
          results.success ? <DisplayPastBarcodes barcodes={results.barcodes}/> : "No data"
          }
        </div>

        <div className='flex flex-row w-full print:block'>
          <DisplayBarcodesWrapper barcodes={results.barcodes} />
        </div>

      </div>
    </>
  )
}

export default Barcodes