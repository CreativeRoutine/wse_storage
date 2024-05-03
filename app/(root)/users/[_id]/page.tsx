import React from 'react'
import Title from '@/components/shared/Title'
import { getUserBy_Id } from '@/lib/actions/user.action'
import Link from 'next/link';
import ChangeUserDepartmentForm from '@/components/shared/user/ChangeUserDepartment';
import ChangeUserAdmin from '@/components/shared/user/ChangeUserAdmin';
import ChangeUserSupervisor from '@/components/shared/user/ChangeUserSupervisor';

import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification';

interface Props {
    _id: string;
    params: any;
}
const page = async ({ params }: { params: { _id: string } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const _id  = params._id;
  const userRequest = await getUserBy_Id({ _id });
  const user = JSON.parse(JSON.stringify(userRequest))

  return (
    <>
      <Title text="User Page" />

      <div className="flex  bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className='w-full flex p-4 gap-4'>
          {/* LEFT SIDE */}
          <div className='w-1/2 flex bg-secondary-200 px-8  py-6 w-full rounded-xl border border-dark-350 shadow-lg'>
            <div className='flex flex-col w-full'>

              <div className="w-full text-white text-lg" key={user._id}>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">User:</div>
                  <div className='text-white font-bold'>{user.name}</div>
                </div>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">Email:</div>
                  <div className='text-white font-bold'>{user.email}</div>
                </div>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">Admin:</div>
                  <div className='text-white font-bold'>{user.admin == true ? <div className='font-bold text-green-500'>Yes</div> : <div className='font-bold text-red-500'>No</div>}</div>
                </div>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">Supervisor:</div>
                  <div className='text-white font-bold'>{user.supervisor == true ? <div className='font-bold text-green-500'>Yes</div> : <div className='font-bold text-red-500'>No</div>}</div>
                </div>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">Department:</div>
                  <div className='text-white font-bold'>{user.department ? user.department.toUpperCase() : "Visitor"}</div>
                </div>
                <div className="w-full flex justify-between border-b border-slate-600 mb-2 py-2">
                  <div className="text-slate-400">Reputation: </div>
                  <div className="text-white font-bold">{user.reputation}</div>
                </div>
                <div className="w-full  mb-2 py-2 flex justify-between">
                  {
                    user.printers.length === 0 ?
                      <div className="flex justify-start">
                        <div className="text-lg text-red-500 font-bold">No printers</div>
                      </div> : 
                      <div className="flex flex-col justify-start w-full">
                        <div className="text-lg text-lime-500">Printers:</div>
                          <ul>
                            {
                              user.printers.map((printer:any, index:number) => {
                                return(
                                  <li key={printer._id} className='mt-2 w-full text-base text-slate-400 flex flex-row items-center justify-start'>
                                    <div className='mr-3'>{index +1}.</div>

                                    <div className='ml-1 mr-6  text-white text-lg flex flex-row'>
                                      <div className='tex-sm text-slate-500 mr-2'>Barcode:</div><Link href={`/printers/${printer.barcode}`} className='hover:text-sky-600 font-bold'>{printer.barcode}</Link>
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

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex flex-col w-1/2 gap-4'>
              <ChangeUserDepartmentForm  mongoUserId={user._id}/>
              <ChangeUserAdmin mongoUserId={user._id} />
              <ChangeUserSupervisor mongoUserId={user._id} />
              
          </div>
          
        </div>
      </div>
    </>
  )
}
export default page