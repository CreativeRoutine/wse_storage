
import React, {Key} from 'react'
import Title from '@/components/shared/Title'
import { getPalet  } from '@/lib/actions/pallet.action'
import Link from 'next/link'
import AddPrinterToPalet from '@/components/shared/pallets/AddPrinterToPalet'
import ChangePaletLocation from '@/components/shared/pallets/ChangePaletLocation'
import ChangePaletCost from '@/components/shared/pallets/ChangePaletCost'

const page = async ({ params }: { params: { barcode: string } }) => {
  
  const barcode = params.barcode;
  const getPaletData = await getPalet({ barcode});
  const getPaletDataPlain = JSON.parse(JSON.stringify(getPaletData));

  return (
    <>
      <Title text="Pallet with printers inside" />

      <div className="flex  bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className='w-full flex p-4 gap-4'>
          {/* LEFT SIDE */}
          <div className='max-w-1/2 flex bg-secondary-200 px-8  py-6 w-full rounded-xl border border-dark-350 shadow-lg'>
            <div className='flex flex-col w-full'>
              {
                getPaletDataPlain ? (
                  getPaletDataPlain.pallets.map((pallet:any) => {
                    return(
                      <div className="w-full text-white text-lg" key={pallet._id as Key}>
                        <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                          <div className="text-slate-400">Barcode:</div>
                          <div className='text-white font-bold'>{pallet.barcode}</div>
                        </div>
                        <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                          <div className="text-slate-400">Location:</div>
                          <div className='text-white font-bold'>{pallet.location}</div>
                        </div>
                        <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                          <div className="text-slate-400">Barcode:</div>
                          <div className='text-white font-bold'>{pallet.barcode}</div>
                        </div>
                        <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                          <div className="text-slate-400">Price: </div>
                          <div className="text-white font-bold"> {pallet.price ? (<div className="text-lime-500 font-bold">USD {pallet.price}</div>  ) : (<div className='text-red-400 text-xl font-bold'>Not set </div>  )  }</div>
                        </div>
                        <div className="w-full  mb-2 py-2 flex justify-between">
                          {
                            pallet.printers.length === 0 ?
                              <div className="flex justify-start">
                                <div className="text-lg text-red-500 font-bold">Pallet is empty</div>
                              </div> : 
                              <div className="flex flex-col justify-start w-full">
                                <div className="text-lg text-lime-500">Printers:</div>
                                  <ul>
                                    {
                                      pallet.printers.map((printer:any, index:number) => {
                                        return(
                                          <li key={printer._id} className='mt-2 w-full text-base text-slate-400 flex flex-row items-center justify-start'>
                                            <div className='mr-3'>{index +1}.</div>

                                            <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                              <div className='tex-sm text-slate-500 mr-2'>Barcode:</div><Link href={`/printers/printer/${printer.barcode}`} className='hover:text-sky-600 font-bold'>{printer.barcode}</Link>
                                            </div>

                                            <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                              <div className='tex-sm text-slate-500 mr-2'>S/N:</div>
                                              <div className='font-bold'>{printer.sn}</div>
                                            </div>

                                            <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                              <div className='tex-sm text-slate-500 mr-2'>Product number:</div>
                                              <div className='font-bold'>{printer.productNumber}</div>
                                            </div>

                                          </li>
                                        ) 
                                      }) 
                                    }
                                  </ul>
                                
                              </div>
                          }
                        </div>
                        
                      </div>
                    )
                  })
                ) : (<div className="text-red-500">No pallets found</div>)
              }          
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex flex-col w-1/2 gap-4'>
              <AddPrinterToPalet barcode={barcode}  mongoUserId="12345"/>
              <ChangePaletLocation barcode={barcode} mongoUserId="12345" />
              <ChangePaletCost barcode={barcode} mongoUserId="12345" />
            
            
            {/* <AddPrinterToPalet sn={currentSN} mongoUserId={''} /> */}

            {/* <SetPaletPrice sn={currentSN} /> */}
            
          </div>
          
        </div>
      </div>
    
    </>
  )
}

export default page