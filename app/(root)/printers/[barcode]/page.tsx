import Title from '@/components/shared/Title'
import { getPrinterPopulated } from '@/lib/actions/printer.action'
import { getPaletById } from '@/lib/actions/pallet.action'
import React from 'react'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { formatTime } from '@/lib/utils'
import DeletePrinter from '@/components/shared/printers/DeletePrinter'
import PinToPallet from '@/components/shared/printers/PinToPallet'

const page = async ({ params }: { params: { barcode: string } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { barcode } = params

  const printer = await getPrinterPopulated({barcode})
  const printers = JSON.parse(JSON.stringify(printer.printers))

  return (
    <>
      <Title text={`Printer - ${barcode}`} />

      <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">

        <div className='w-auto'>
          <Image 
          src="/assets/printers_preview/402.png" 
          width={240} 
          height={240} 
          className="p-4"
          alt="printer" 
          />
          {printers[0].pallet ? <div className='text-white text-lg'>Added to pallet</div> : <PinToPallet barcode={barcode} mongoUserId={userId} /> }
          
          <DeletePrinter barcode={barcode} mongoUserId={userId} />
        </div>

        {
          printers.map( 
            (item:any) => (
              <div className="flex flex-col w-auto max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">S/N:</div>
                  <div className="font-bold text-lime-400">{item.sn}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">PO number:</div>
                  <div className="font-bold text-lime-400">{item.ponumber ? item.ponumber : <span className="text-red-500">No PO number</span>}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">Product number:</div>
                  <div className="font-bold text-sky-400">{item.productNumber ? item.productNumber : <span className="text-red-500">No product number</span>}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">Barcode:</div>
                  <div className="font-bold text-sky-400">{item.barcode ? item.barcode : <span className="text-red-500">No barcode</span>}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">Created on:</div>
                  <div className="font-bold text-sky-400">{item.createdOn ? formatTime(item.createdOn, "date") : <span className="text-red-500">No date</span>}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">Time:</div>
                  <div className="font-bold text-sky-400">{item.createdOn ? formatTime(item.createdOn, "time") : <span className="text-red-500">No date</span>}</div>
                </div>
                <div className="flex justify-between w-full text-white mb-3">
                  <div className="font-base">Condition:</div>
                  <div className="font-bold text-sky-400">{item.addedOn ? item.AddedOn : <span className="text-red-500">Not examined yet</span>}</div>
                </div>

                {
                  item.pallet ? 
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-base">Pallet:</div>
                    <div className="font-bold text-sky-400">
                      <Link href={`/storage/${JSON.parse(JSON.stringify(item.pallet.barcode))}`}>{JSON.stringify(item.pallet.barcode)}</Link>
                      </div>
                  </div> : null
                }
              </div>
            )
           ) 
        }

        <div className="flex flex-col w-auto max-w-1/s bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
          <div className="text-white text-xl font-bold">No works performed yet...</div>
        </div>
      </div>
    </>
  )
}

export default page