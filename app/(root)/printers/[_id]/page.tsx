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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ITaskPerformed {
  date: Date;
  user: {
    name: string;
    lastName: string;
  };
  overallCondition: string;
  cleanliness: string;
  workable: boolean;
  repariable: boolean;
  changedParts: string[];
  afterRefurbish: string;
  pagesNumber: number;
  tested: string[];
  timeSpent: number;
}

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


      <div className="flex flex-col gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 lg:flex-row">

        {/* // Preview */}
        <div className='relative min-w-[300px]'>
          {
            printers.preview ? (
              <Image 
                src={printers.preview} 
                width={240} 
                height={240} 
                className="p-4"
                alt="printer" 
                />
            ) : (
              <Image 
                src="/assets/printers_preview/NoPreview.webp" 
                width={240} 
                height={240} 
                className="p-4"
                alt="printer" 
              />
            )
          }
          {/* DIALOG */}
          <div className='absolute top-0 right-0'>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-auto bg-primary-500 text-white">
                  <Image 
                    src="/assets/icons/gear.svg" 
                    width={24} 
                    height={24} 
                    className="invert-color"
                    alt="printer" 
                  />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-dark-100">
                <DialogHeader>
                  <DialogTitle className="text-white">Share link</DialogTitle>
                  <DialogDescription className="text-white">
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                  <div className="w-full flex flex-col bg-secondary-200 px-6 mb-2 pt-6 pb-6 rounded-xl border border-dark-350 shadow-lg gap-4">
                    <UpdatePrinterPON mongoUserId={userId} id={_id} />
                    {printers.pallet ? <div className='text-white text-lg'>Added to pallet</div> : <PinToPallet id={_id} mongoUserId={userId} /> }
                    <DeletePrinter id={_id} mongoUserId={userId} />
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

          {/* // Detals */}
          <div className="flex flex-col w-full bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <div className="!text-white !text-xl font-semibold">Printer details:</div>
            
            <div className='mt-4'>
              <ul>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                  <div className='text-slate-400'>S/N:</div>
                  <div className='flex justify-end '>{printer.sn}</div>
                </li>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                  <div className='text-slate-400'>PO number:</div>
                  <div className='flex justify-end'>{printer.ponumber ? printer.ponumber : <span className="text-red-500">No PO number</span>}</div>
                </li>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>   
                  <div className='text-slate-400'>Product number:</div>
                  <div className='flex justify-end'>{printer.productNumber ? printer.productNumber : <span className="text-red-500">No product number</span>}</div>
                </li>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                  <div className='text-slate-400'>Barcode:</div>
                  <div className='flex justify-end'>{printer.barcode ? printer.barcode : <span className="text-red-500">No barcode</span>}</div>
                </li>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                  <div className='text-slate-400'>Created on:</div>
                  <div className='flex justify-end'>{printer.createdOn ? formatTime(printer.createdOn, "date") : <span className="text-red-500">No date</span>}</div>
                </li>
                <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                  <div className='text-slate-400'>Time:</div>
                  <div className='flex justify-end'>{printer.createdOn ? formatTime(printer.createdOn, "time") : <span className="text-red-500">No date</span>}</div>  
                </li>
                  {
                    printer.pallet ? (
                      <li className='border-b border-dark-500 flex justify-between py-3 text-white'>
                        <>
                          <div className=''>Pallet / Location:</div>
                          <div className=' flex justify-end'><Link href={`/storage/${JSON.parse(JSON.stringify(printer.pallet._id))}`}>{printer.pallet.barcode} {printer.pallet.location ? (`/ ${printer.pallet.location}`) : null } </Link></div>
                        </>
                      </li>
                    ) : (null)
                    }
              </ul>


            </div>
          </div>

        </div>

      

      {/* // Tasks */}
        <div className="flex flex-col w-auto max-w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
          <div className="!text-white !text-xl font-semibold mb-2 pb-4 border-b border-slate-400">Tasks</div>

          {/* <Accordion type="multiple" >

            <AccordionItem value="item-1">
              <AccordionTrigger className='text-white'>Is it accessible?</AccordionTrigger>
              <AccordionContent className='text-white'>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>

          </Accordion> */}
          
          {printer.tasksPerformed && printer.tasksPerformed.length > 0 ?
          (
            printer.tasksPerformed.map((task: ITaskPerformed) => (
              <div key={task.date.toString()} className='flex flex-col '>
                <ul className='mt-4'>
                  <div className='text-white'>Date:</div>
                  <div className='!text-white flex justify-end'>{task.date ? formatTime(task.date, "date") : <span className="text-red-500">No date</span>}</div>

                  <div className='text-white'>User:</div>
                  <div className='!text-white flex justify-end'>{task.user ? task.user.name : <span className="text-red-500">No user</span>}</div>

                  <div className='text-white'>Overall condition:</div>
                  <div className='!text-white flex justify-end'>{task.overallCondition ? task.overallCondition : <span className="text-red-500">No condition</span>}</div>

                  <div className='text-white'>Cleanliness:</div>
                  <div className='!text-white flex justify-end'>{task.cleanliness ? task.cleanliness : <span className="text-red-500">No cleanliness</span>}</div>

                  <div className='text-white'>Workable:</div>
                  <div className='!text-white flex justify-end'>{task.workable ? "Yes" : "No"}</div>

                  <div className='text-white'>Repariable:</div>
                  <div className='!text-white flex justify-end'>{task.repariable ? "Yes" : "No"}</div>

                  <div className='text-white'>Changed parts:</div>
                  <div className='!text-white flex justify-end'>{task.changedParts ? task.changedParts.join(', ') : <span className="text-red-500">No parts</span>}</div>

                  <div className='text-white'>After refurbish:</div>
                  <div className='!text-white flex justify-end'>{task.afterRefurbish ? task.afterRefurbish : <span className="text-red-500">No refurbish</span>}</div>

                  <div className='text-white'>Pages number:</div>
                  <div className='!text-white flex justify-end'>{task.pagesNumber ? task.pagesNumber : <span className="text-red-500">No pages</span>}</div>

                  <div className='text-white'>Tested:</div>
                  <div className='!text-white flex justify-end'>{task.tested ? task.tested.join(', ') : <span className="text-red-500">No parts</span>}</div>

                  <div className='text-white'>Time spent:</div>
                  <div className='!text-white flex justify-end'>{task.timeSpent ? (`${task.timeSpent} sec.` ) : "---"}</div>
                </ul>
              </div>
            )
            )

          ) : 
          (<div className="text-white text-xl font-bold mt-4">No works performed yet...</div>)
          }
        </div>
      </div>
    </>
  )
  }
}

export default page