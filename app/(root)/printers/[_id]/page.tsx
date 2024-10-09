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
  additionalInfo: string;
  status: string;
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

  function formatTimeSpent(seconds: number): string {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h. ${minutes}m.`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m. ${remainingSeconds}s.`;
    } else {
      return `${seconds} sec.`;
    }
  }

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
                  <DialogTitle className="text-white mb-2">Settings</DialogTitle>
                  {/* <DialogDescription className="text-white">
                    Anyone who has this link will be able to view this.
                  </DialogDescription> */}
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
        <div className="flex flex-col w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
          <div className="!text-white !text-xl font-semibold mb-2 pb-4 border-b border-slate-400">Tasks</div>

          {printer.tasksPerformed && printer.tasksPerformed.length >= 1 ?
          (
            <>
              <Accordion type="multiple" className='w-full py-2 mb-2' >
              {
                printer.tasksPerformed.slice().reverse().map((task: ITaskPerformed) => (
                  <AccordionItem key={task.date.toString()} value={task.date.toString()} className='w-full bg-dark-300 border-0 mb-3 rounded-lg shadow-lg'  >

                    <AccordionTrigger className='text-white min-w-[320px] px-4'>
                      <div className='text-slate-400 text-sm flex flex-row items-end'>Date:
                        <span className='!text-white text-lg font-bold flex justify-end pl-2 mb-[-4px]'>{task.date ? formatTime(task.date, "date") : <span className="text-red-500">No date</span>}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className='text-white bg-dark-400 px-4'>
                      <div key={task.date.toString()} className='flex flex-col '>
                        <ul className='mt-4'>
                          {/* TECH'S NAME */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Tech:</div>
                            <div className='!text-white flex justify-end font-bold text-md'>{task.user ? task.user.name : <span className="text-red-500">No user</span>}</div>
                          </li>
                          {/* CONDITION */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Overall condition:</div>
                            <div className='!text-white flex justify-end'>{task.overallCondition ? (
                              task.overallCondition === "Good" ? <span className="text-green-500 text-md">{task.overallCondition}</span> :
                              task.overallCondition === "Damaged" ? <span className="text-yellow-500 text-md">{task.overallCondition}</span> :
                               <span className="text-red-500 text-md">{task.overallCondition}</span>
                              ) : <span className="text-red-500 text-md">No condition</span>}</div>
                          </li>
                          {/* CLEAN */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Cleanliness:</div>
                            <div className='!text-white flex justify-end'>{task.cleanliness ? (
                              task.cleanliness === "Clean" ? <span className="text-black p-2 bg-white rounded-lg">{task.cleanliness}</span> :
                              task.cleanliness === "Dirty" ? <span className="text-white p-2 bg-stone-500 rounded-lg">{task.cleanliness}</span> :
                               <span className="text-yellow-400 p-2 bg-stone-700 rounded-lg">{task.cleanliness}</span>
                              ) : <span className="text-red-500">No cleanliness</span>}</div>
                          </li>
                          {/* WORKABLE */}
                          <li className='flex justify-between items-center border-b border-gray-700 py-3'>
                            <div className='text-slate-400  flex flex-col'>
                              <span className="text-lg" >Workable:</span>
                              <span className="text-sm">Turns on and shows signs of life</span>
                            </div>
                            <div className='flex justify-end'>{task.workable ? (<span className='text-green-500 text-lg' >Yes</span>  ) : (<span className='text-red-500 text-lg' >No</span>  )}</div>
                          </li>
                          {/* REPARIABLE */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Repariable:</div>
                            <div className='flex justify-end'>{task.repariable ? (<span className='text-green-500' >Yes</span>  ) : (<span className='text-red-500' >No</span>  )}</div>
                          </li>
                          {/* PARTS CHANGED */}
                          <li className='flex flex-row justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Changed parts:</div>
                            <div className='!text-white text-right ml-auto flex flex-wrap justify-end'>
                              {task.changedParts && task.changedParts.length > 0 ? (
                                task.changedParts.map((part: string, index: number) => (
                                  <span key={index} className='text-black p-2 bg-white ml-1 mb-1 rounded-lg'>{part}</span>
                                ))
                              ) : (
                                <span className="text-red-500">No parts changed</span>
                              )}
                            </div>
                          </li>
                          {/* PAGES NUM */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Pages number:</div>
                            <div className='!text-white flex justify-end'>{task.pagesNumber ? (<span className='font-bold text-md'>{task.pagesNumber} pages.</span> ) : <span className="text-red-500">Not defined</span>}</div>
                          </li>
                          {/* TESTED  */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Tested:</div>
                            <div className='!text-white text-right ml-auto flex flex-wrap justify-end'>
                              {task.tested && task.tested.length > 0 ? (
                                task.tested.map((part: string, index: number) => (
                                  <span key={index} className='text-black p-2 bg-white ml-1 mb-1 rounded-lg'>{part}</span>
                                ))
                              ) : (
                                <span className="text-red-500">Not tested</span>
                              )}
                            </div>

                            {/* <div className='!text-white flex text-right ml-auto'>{task.tested ? task.tested.join(', ') : <span className="text-red-500">No parts</span>}</div> */}
                          </li>
                          {/* TIME SPENT */}
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Time spent:</div>
                            <div className='!text-white flex justify-end font-bold text-md'>
                              {task.timeSpent ? formatTimeSpent(task.timeSpent) : "---"}
                            </div>
                          </li>
                          {/* ADDITIONAL INFO */}
                          <li className='flex justify-between  py-3'>
                            <div className='text-slate-400'>Tech's comments:</div>
                            <div className='!text-white flex justify-end'>{task.additionalInfo ? (`${task.additionalInfo}` ) : (<span className='text-gray-400 text-lg italic'>No comments left</span>  )}</div>
                          </li>
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>After refurbish:</div>
                            <div className='!text-white flex justify-end'>
                              { task.afterRefurbish === "Refurbished (workable)" ? 
                                (<span className="text-green-500">Refurbished</span>) :
                                (<span className="text-red-500">Broken in process</span>) 
                              }
                            </div>
                          </li>
                          <li className='flex justify-between border-b border-gray-700 py-3'>
                            <div className='text-slate-400'>Status:</div>
                            <div className='!text-white flex justify-end'>
                              { task.status ? task.status : "No status" }
                            </div>
                          </li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                )
                )
              }
              </Accordion>
            </>
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