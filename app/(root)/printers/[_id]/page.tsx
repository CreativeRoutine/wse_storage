import Title from '@/components/shared/Title'
import { getPrinterPopulated } from '@/lib/actions/printer.action'
import React from 'react'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { formatTime } from '@/lib/utils'
import DeletePrinter from '@/components/shared/printers/DeletePrinter'
import PinToPallet from '@/components/shared/printers/PinToPallet'
import UpdatePrinterPON from '@/components/shared/printers/UpdatePrinterPON'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/tw/description-list'
import { Subheading } from '@/components/tw/heading'

const page = async ({ params }: { params: { _id: string } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { _id } = params


  const printer = await getPrinterPopulated({
    _id,
    path: ''
  })
  const printers = JSON.parse(JSON.stringify(printer))

  if (printers) {
  return (
    <>
      <Title text={`Printer - ${printers.name ? printers.name : _id}`} />

      <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">

        <div className='w-auto'>
          <Image 
          src="/assets/printers_preview/402.png" 
          width={240} 
          height={240} 
          className="p-4"
          alt="printer" 
          />
          <div className='w-full flex flex-col bg-secondary-200 px-6 mb-2 pt-6 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <UpdatePrinterPON mongoUserId={userId} id={_id} />
          </div>

          
          <div className='w-full flex flex-col bg-secondary-200 px-6 mb-2 pt-6 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            {printers.pallet ? <div className='text-white text-lg'>Added to pallet</div> : <PinToPallet id={_id} mongoUserId={userId} /> }
          </div>
            <DeletePrinter id={_id} mongoUserId={userId} />
        </div>

        {
          <>
          <div className="flex flex-col w-full lg:w-1/2  bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg">Printer details:</Subheading>
            <DescriptionList className='mt-4'>

              <DescriptionTerm className='text-white'>S/N:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.sn}</DescriptionDetails>

              <DescriptionTerm className='text-white'>PO number:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.ponumber ? printer.ponumber : <span className="text-red-500">No PO number</span>}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Product number:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.productNumber ? printer.productNumber : <span className="text-red-500">No product number</span>}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Barcode:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.barcode ? printer.barcode : <span className="text-red-500">No barcode</span>}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Created on:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.createdOn ? formatTime(printer.createdOn, "date") : <span className="text-red-500">No date</span>}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Time:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.createdOn ? formatTime(printer.createdOn, "time") : <span className="text-red-500">No date</span>}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Condition:</DescriptionTerm>
              <DescriptionDetails className='!text-white flex justify-end'>{printer.addedOn ? printer.AddedOn : <span className="text-red-500">Not examined yet</span>}</DescriptionDetails>

              

              {
                  printer.pallet ? 
                  <>
                    <DescriptionTerm className='text-white'>Pallet / Location:</DescriptionTerm>
                    <DescriptionDetails className='!text-white flex justify-end'><Link href={`/storage/${JSON.parse(JSON.stringify(printer.pallet._id))}`}>{printer.pallet.barcode} {printer.pallet.location ? (`/ ${printer.pallet.location}`) : null } </Link></DescriptionDetails>
                  </> : null
                  
                }


            </DescriptionList>
          </div>
          </>
          
        }

        <div className="flex flex-col w-auto max-w-1/s bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
          <div className="text-white text-xl font-bold">No works performed yet...</div>
        </div>
      </div>
    </>
  )
  }
}

export default page