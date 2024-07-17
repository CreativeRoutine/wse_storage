
import React, {Key} from 'react'
import Title from '@/components/shared/Title'
import { getPalet  } from '@/lib/actions/pallet.action'
import Link from 'next/link'
import AddPrinterToPalet from '@/components/shared/pallets/AddPrinterToPalet'
import ChangePaletLocation from '@/components/shared/pallets/ChangePaletLocation'
import ChangePaletCost from '@/components/shared/pallets/ChangePaletCost'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { Button } from '@/components/ui/button'
import DeletePalet from '@/components/shared/pallets/DeletePalet'
import UnPinPrinter from '@/components/shared/printers/UnPinPrinter'


const page = async ({ params }: { params: { _id: string } }) => {
  
  const {userId} = auth();
  if(!userId) redirect('/sign-in')
    const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }
  
  const { _id } = params

  const getPaletData = await getPalet({ _id});
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
                  <div className="w-full text-white text-lg" key={getPaletDataPlain._id as Key}>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">PO number:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.ponumber}</div>
                    </div>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Location:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.location ? (getPaletDataPlain.location) : ("Not set") }</div>
                    </div>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Barcode:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.barcode}</div>
                    </div>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Price: </div>
                      <div className="text-white font-bold">{getPaletDataPlain.price ? (<div className="text-lime-500 font-bold"><span className='text-sm font-normal'>USD</span> {getPaletDataPlain.price}</div>  ) : (<div className='text-red-400 text-xl font-bold'>Not set </div>  )  }</div>
                    </div>
                    <div className="w-full  mb-2 py-2 flex justify-between">
                      {
                        getPaletDataPlain.printers.length === 0 ?
                          <div className="flex w-full justify-between items-center">
                            <div className="text-lg text-red-500 font-bold">Pallet is empty</div>

                            <DeletePalet id={getPaletDataPlain._id} mongoUserId={mongoUser._id} />

                          </div> : 
                          // IF THERE ARE PRINTERS ON PALLET
                          <div className="flex flex-col justify-start w-full">
                            <div className="text-lg text-lime-500">Printers:</div>
                              <ul>
                                {
                                  getPaletDataPlain.printers.map((printer:any, index:number) => {
                                    return(
                                      <li key={printer._id} className='mt-2 w-full text-base text-slate-400 flex flex-row items-center justify-start'>
                                        <div className='mr-3'>{index +1}.</div>

                                        <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                          <div className='tex-sm text-slate-500 mr-2'>Barcode:</div><Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.barcode}</Link>
                                        </div>

                                        <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                          <div className='tex-sm text-slate-500 mr-2'>S/N:</div>
                                          <div className=''>{printer.sn}</div>
                                        </div>

                                        <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                          <div className='tex-sm text-slate-500 mr-2'>Prod. num.:</div>
                                          <div className=''>{printer.productNumber}</div>
                                        </div>

                                        <UnPinPrinter id={_id} printerId={printer._id} mongoUserId={mongoUser._id} />

                                      </li>
                                    ) 
                                  }) 
                                }
                              </ul>
                            
                          </div>
                      }
                    </div>
                    
                  </div>
                ) : (<div className="text-red-500">No pallets found</div>)
              }          
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex flex-col w-1/2 gap-4'>
              <AddPrinterToPalet id={_id}  mongoUserId="12345"/>
              <ChangePaletLocation id={_id} mongoUserId="12345" />
              <ChangePaletCost id={_id} mongoUserId="12345" />

            
          </div>
          
        </div>
      </div>
    
    </>
  )
}

export default page