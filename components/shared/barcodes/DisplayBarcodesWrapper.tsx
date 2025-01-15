"use client"
import React, {useState} from 'react'
import DisplayBarcodes from '@/components/shared/barcodes/DisplayBarcodes';
import CreateBarcodes from '@/components/shared/barcodes/CreateBarcodes';

interface Props {
  barcodes: any;
}

const DisplayBarcodesWrapper = ({barcodes}:Props) => {
  const [tempBarcodes, setTempBarcodes] = useState({type: "WSE-PP", start: "1", finish: "1"});
  return (
    <div className='flex flex-row gap-4 w-full'>  
      <div className="bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:hidden">
        <CreateBarcodes barcodes={barcodes} setTempBarcodes={setTempBarcodes}/>
      </div>
      <div className='bg-secondary-200 px-6 mb-1 py-6 w-1/2 rounded-xl print:block'>
        <DisplayBarcodes type={tempBarcodes.type} start={tempBarcodes.start} finish={tempBarcodes.finish} />
      </div>
    </div>
  )
}
export default DisplayBarcodesWrapper;