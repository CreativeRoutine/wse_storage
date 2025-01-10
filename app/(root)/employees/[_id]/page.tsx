import Title from '@/components/shared/Title'
import { getPrinterPopulated } from '@/lib/actions/printer.action'
import React from 'react'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getEmployeesById, getUserById } from '@/lib/actions/user.action'
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
import CommentToPrinter from '@/components/shared/printers/CommentToPrinter'
import ChangeUserName from '@/components/shared/user/ChangeUserName'


const page = async ({ params }: { params: { _id: any } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')

  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { _id } = params

  const user = await getEmployeesById({_id})
  const users = JSON.parse(JSON.stringify(user))
  
  // console.log(users)
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


  if(user){
    return (
      <>
        <Title text={`User - ${users.name ? users.name : _id}`} />
        {/* <Title text={"User's page "} /> */}
  
  
        <div className="flex flex-col gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 lg:flex-row">
          {/* // Tasks */}
          <div className="flex flex-col w-full lg:w-1/2  bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <div className="!text-white !text-xl font-semibold mb-2 pb-4 border-b border-slate-400">{users.name}</div>

            <ul className=''>
              {
                users.printers.map((printer:any, i:any) => (
                  <li key={printer._id} className='text-white odd:bg-dark-600 even:transparent mb-2 p-2 rounded-lg'>
                    <div className='flex flex-row justify-between'>
                      <div>Printer: </div><span><Link className='hover:text-slate-400' href={`/printers/${printer.printerId}`}>{printer.printerId}</Link></span>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <div>Time spent: </div><span>{formatTimeSpent(printer.timeSpent)}</span>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <div>Work performed: </div><span>{formatTime(printer.date, "date")}</span>
                    </div>
                  </li>
                ))
              }
            </ul>
            
          </div>

          
          <div className="flex flex-col w-full lg:w-1/2  bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
              <div>
                <h2 className='text-xl font-bold text-white'>User data:</h2>
                <ul className=''>
                  <li className='text-white mt-4'>{users.name}</li>
                  <li className='text-white mt-2'>{users.lastName}</li>
                </ul>
              </div>
            <ChangeUserName _id={_id} />
          </div>
          
          
        </div>
      </>
    )

  }

  
}

export default page