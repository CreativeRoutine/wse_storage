import React from 'react'
import Title from "@/components/shared/Title";


import { getBarcodes } from '@/lib/actions/barcodes.action';
import DisplayPastBarcodes from '@/components/shared/barcodes/DisplayPastBarcodes';
import DisplayBarcodesWrapper from '@/components/shared/barcodes/DisplayBarcodesWrapper';


const Barcodes = async () => {

  const results = await getBarcodes();

  // console.log("THIS IS RESULTS",results.barcodes)


  // const [startPrinters, setStartPrinters] = useState(null);
  // const [finishPrinters, setFinishPrinters] = useState(null);

  // const [startParts, setStartParts] = useState(null);
  // const [finishParts, setFinishParts] = useState(null);

  // const [startPallets, setStartPallets] = useState(null);
  // const [finishPallets, setFinishPallets] = useState(null);

  // const [startStorage, setStartStorage] = useState(null);
  // const [finishStorage, setFinishStorage] = useState(null);




  return (
    <>
      <div className='-mt-12 print:hidden'>
        <Title text={"Barcodes"} />
      </div>

      <div className='mt-4 bg-dark-600 rounded-xl p-4 text-white flex flex-col w-full'>
        <div className='print:hidden'>
          <DisplayPastBarcodes barcodes={results.barcodes}/>

        </div>

        <div className='flex flex-row w-full print:block'>
          <DisplayBarcodesWrapper barcodes={results.barcodes} />
        </div>

      </div>
        



      
    </>
  )
}

export default Barcodes
