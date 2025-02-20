
import React, {Key} from 'react'
import Title from '@/components/shared/Title'
import { getPalet  } from '@/lib/actions/pallet.action'
import Link from 'next/link'
import AddPrinterToPalet from '@/components/shared/pallets/AddPrinterToPalet'
import ChangePaletCost from '@/components/shared/pallets/ChangePaletCost'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { getSupplierPallet } from '@/lib/actions/supplier.action'
import { formatTime } from '@/lib/utils'
import DeleteEmptySuppliersPallet from '@/components/shared/suppliers/DeleteEmptySuppliersPallet'
import ChangePrinterPrice from '@/components/shared/printers/ChangePrinterPrice'


const page = async ({ params }: { params: { _id: string } }) => {
  
  const {userId} = auth();
  if(!userId) redirect('/sign-in')
    const mongoUserData = await getUserById({userId})
    const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }
  
  const { _id } = params

  const getPaletData = await getSupplierPallet(_id);

  
  const getPaletDataPlain = JSON.parse(JSON.stringify(getPaletData));

  return (
    <>
      <Title text="Supplier's pallet with printers inside:" />

      <div className="flex  bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className='w-full flex p-4 gap-4'>
          {/* LEFT SIDE */}
          <div className='max-w-1/2 flex bg-secondary-200 px-8  py-6 w-full rounded-xl border border-dark-350 shadow-lg'>
            <div className='flex flex-col w-full'>
              {
                getPaletDataPlain ? (
                  <div className="w-full text-white text-lg" key={getPaletDataPlain._id as Key}>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Name:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.supplier?.name ? getPaletDataPlain.supplier.name || "Not available" : null}</div>
                    </div>
                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">PO number:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.supplier?.ponumber ? getPaletDataPlain.supplier.ponumber || "Not available" : null}</div>
                    </div>

                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Barcode / Shipment ID:</div>
                      <div className='text-white font-bold'>{getPaletDataPlain.pallet?.barcode}</div>
                    </div>

                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Created:</div>
                      <div className='text-white font-bold'>{formatTime(getPaletDataPlain.pallet?.createdOn, "full")}</div>
                    </div>

                    <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                      <div className="text-slate-400">Price: </div>
                      <div className="text-white font-bold">{getPaletDataPlain.pallet?.price ? (<div className="text-lime-500 font-bold"><span className='text-sm font-normal'>USD</span> {getPaletDataPlain.pallet.price}</div>  ) : (<div className='text-red-400 text-xl font-bold'>Not set </div>  )  }</div>
                    </div>

                    <div className="w-full  mb-2 py-2 flex justify-between">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th scope="col" className="text-left font-bold text-slate-100">#</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Barcode</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Serial number</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Product numb.</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Name</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Quality</th>
                          <th scope="col" className="text-left font-bold text-slate-100">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-transparent">
                        {
                          getPaletDataPlain.pallet?.printers?.length === 0 ?
                          <tr >
                            <td></td>
                            <td><div className="text-lg text-red-500 font-bold">Pallet is empty</div></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <DeleteEmptySuppliersPallet id={_id} />

                            </td>
                          </tr> : 
                            <>
                              {
                                getPaletDataPlain.pallet?.printers.map((printer:any, index:number) => {
                                  return(
                                    <tr key={printer._id}>
                                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                          <div className="text-white">{index+ 1 }</div>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                        <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.barcode}</Link>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                        <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.sn}</Link>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                        <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.productNumber}</Link>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                        <div className="flex items-center">
                                        <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.name ? printer.name : "Not set" }</Link>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-3 pl-4 text-sm sm:pl-0">
                                        <div className="flex justify-between items-center">
                                          <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.parts ? 
                                          <div className='bg-red-500 p-2 rounded-lg rotate-180'><Image height={20} width={20} src="/assets/icons/like.svg" alt="Bad" /></div> : 
                                          <div className='bg-green-500 p-2 rounded-lg'><Image height={20} width={20} src="/assets/icons/like.svg" alt="Good" /></div>}</Link>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap py-3 pl-4 text-sm sm:pl-0">
                                        <div className="flex justify-between items-center">
                                          <Link href={`/printers/${printer._id}`} className='hover:text-sky-600'>{printer.price ? printer.price.toFixed(2) : "Not set"}</Link>
                                          <ChangePrinterPrice id={printer._id} />
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </>
                        }
                      </tbody> 
                    </table>
                      
                      
                    </div>
                    
                  </div>
                ) : (<div className="text-red-500">No pallets found</div>)
              }          
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex flex-col w-1/2 gap-4'>
              <AddPrinterToPalet id={_id}  mongoUserId="12345"/>
              {/* <ChangePaletLocation id={_id} mongoUserId="12345" /> */}
              <ChangePaletCost id={_id} />

            
          </div>
          
        </div>
      </div>
    
    </>
  )
}

export default page