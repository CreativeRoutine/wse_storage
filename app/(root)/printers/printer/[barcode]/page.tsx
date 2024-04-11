import Title from '@/components/shared/Title'
import { getPrinter } from '@/lib/actions/printer.action'
import React from 'react'
import Image from 'next/image'

const page = async ({ params }: { params: { barcode: string } }) => {
  const { barcode } = params

  const printer = await getPrinter({barcode})
  const printers = JSON.parse(JSON.stringify(printer.printer))

  return (
    <>
      <Title text={`Printer - ${barcode}`} />
      <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">

        <div className='w-1/3'>
          <Image 
          src="/assets/printers_preview/402.png" 
          width={240} 
          height={240} 
          className="p-4"
          alt="printer" 
          />
        </div>

        {
          printers.map( 
            (item:any) => (
              <div className="flex flex-col w-1/3 max-w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-semibold">S/N:</div>
                  <div className="font-bold text-lime-400">{item.sn}</div>
                </div>
              <div className="flex justify-between w-full text-white mb-3">
            <div className="font-semibold">Product number:</div>
            <div className="font-bold text-sky-400">{item.productNumber ? item.productNumber : <span className="text-red-500">No product number</span>}</div>
          </div>
          <div className="flex justify-between w-full text-white mb-3">
            <div className="font-semibold">Barcode:</div>
            <div className="font-bold text-sky-400">{item.barcode ? item.barcode : <span className="text-red-500">No barcode</span>}</div>
          </div>
          <div className="flex justify-between w-full text-white mb-3">
            <div className="font-semibold">Added on:</div>
            <div className="font-bold text-sky-400">{item.addedOn ? item.AddedOn : <span className="text-red-500">No date</span>}</div>
          </div>
          <div className="flex justify-between w-full text-white mb-3">
            <div className="font-semibold">Condition:</div>
            <div className="font-bold text-sky-400">{item.addedOn ? item.AddedOn : <span className="text-red-500">Not examined yet</span>}</div>
          </div>
        </div>
            )
           ) 
        }

        <div className="flex flex-col w-1/3 max-w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
          <div className="text-white text-xl font-bold">No works performed yet...</div>
        </div>



      </div>
    </>
  )
}

export default page