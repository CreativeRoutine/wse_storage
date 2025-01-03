import Title from '@/components/shared/Title'

import React from 'react'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import {formatTime} from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { getPartById } from '@/lib/actions/parts.action'
import { Progress } from '@/components/ui/progress'
import ChangePartLocation from '@/components/shared/parts/ChangePartLocation'




const page = async ({ params }: { params: { _id: string } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { _id } = params

  const calcPercent = (val1:any, val2:any) => {
    return Math.round((val1 / val2) * 100);
  }

  const parts = await getPartById({
    _id,
  })
  const part = JSON.parse(JSON.stringify(parts))

  const printerName = part[0].printerName


  if (part) {
  return (
    <>
      <Title text={`Parts for ${part[0].printerName ? part[0].printerName : _id}`} link="/parts" linkText="Back"/>


      <div className="flex flex-col gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 lg:flex-row">

      

        {/* // Preview */}
        <div className='relative w-full'>
          {
            part[0].parts ? part[0].parts.map((item:any) => (

              <div key={item._id} className='text-white text-lg bg-dark-300 mb-4 rounded-lg'>
                {/* <div className="p-2 mb-2"> */}
                  <div className='text-xl font-bold mb-4 flex flex-row items-end bg-dark-400 rounded-lg p-4'>
                    {item.partsName} 
                    <span className="w-1/5 flex flex-row items-center ml-8 mb-1">
                      <span className='text-sm flex flex-row min-w-[50px] text-slate-400 font-thin mr-2'>{item.part.length} of {item.maxParts}</span>
                      <span className='w-full'><Progress value={calcPercent(item.part.length, item.maxParts)} className="h-2"  /></span>
                    </span>
                  </div>
                  <ul className='mt-2 p-4  rounded-lg'>
                    {
                      item.part.map((part:any, i:any)=>(
                        <li key={part._id} className="flex flex-row justify-between w-full mb-2 py-2 border-b border-slate-600 last:border-0">
                          <div className='text-slate-400 '>Barcode: {part.barcode ? <span className='ml-2'>{part.barcode}</span> : <span className='text-red-500 ml-2'>Not set yet</span>}</div>
                          <div className='text-slate-400 '>From printer: {part.from ? <Link href={`/printers/${part.from}`} className='text-white hover:text-slate-600 ml-2'>{part.from}</Link> : <span className='text-red-500'>Not set yet</span>}</div>
                          <div className='text-slate-400 '>Added on: <span className='text-white font-semibold ml-2'>{formatTime(part.createdOn, "full")}</span></div>
                          <div className='text-slate-400 '>Location: <span className='text-white font-semibold ml-2'>{part.location ? part.location : <span className='text-red-500'>Not set yet</span>}</span></div>
                          <div className=''>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-[32px] h-[32px] bg-primary-500 text-white p-2">
                                  <Image 
                                    src="/assets/icons/gear.svg" 
                                    width={16} 
                                    height={16} 
                                    className="invert-color"
                                    alt="printer" 
                                  />
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="sm:max-w-md bg-dark-100">
                                <DialogHeader>
                                  <DialogTitle className="text-white mb-2">Add location (box)</DialogTitle>
                                  
                                </DialogHeader>

                                  <div className="w-full flex flex-col bg-secondary-200 px-6 mb-2 pt-6 pb-6 rounded-xl border border-dark-350 shadow-lg gap-4">
                                    <ChangePartLocation printer={printerName} partName={item.partsName} id={part._id} />
                                  </div>
                                <DialogFooter className="sm:justify-end">
                                  <DialogClose asChild>
                                    <Button type="button" className="text-white" variant="secondary">
                                      Close
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                {/* </div> */}
              </div>



            )) : null
          }

        </div>
 
        
      </div>
    </>
  )
  }
}

export default page