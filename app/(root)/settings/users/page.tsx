import React, { Key} from "react";
import Link from "next/link";
import {getPrinters} from "@/lib/actions/printer.action";
import { Badge } from "@/components/ui/badge";
import Title from "@/components/shared/Title";
import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect, usePathname } from "next/navigation";
import VisitorNotification from "@/components/shared/VisitorNotification";

import SettingsNav from "@/components/shared/SettingsNav";
import { SearchParamsProps } from "@/types";
import { getUsers } from '@/lib/actions/user.action'

const UsersSettings = async ({searchParams}: SearchParamsProps) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')

  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
    
  if(mongoUser.department === "visitor" ){
    return(<VisitorNotification />)
  }

  const usersRaw = await getUsers({});
  const users = JSON.parse(JSON.stringify(usersRaw.users))

  return (
    <>
      <Title text="Settings page - Users" />

      <div className="flex items-center justify-between text-white">
        <SettingsNav />
      </div>
  
      {/* LIST OF SUPPLIERS */}
      <div className="mt-8 py-4 px-8 mb-2 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
        <div className="w-full text-lg">

          <div className="grid grid-cols-6 gap-2 mb-4 bg-dark-300 p-4 rounded-lg">
            <div className='border-r border-dark-100 text-left pl-4'>Name</div>
            <div className='border-r border-dark-100 text-center'>Username</div>
            <div className='border-r border-dark-100 text-center'>Department</div>
            <div className='border-r border-dark-100 text-center'>Admin</div>
            <div className='border-r border-dark-100 text-center'>Supervisor</div>
          <div className='text-center'>Actions</div>
            
          </div>
          
          {users.map((user:any) => {
            return(
              <div key={user._id} className="group h-14 grid grid-cols-6 gap-2 mb-2 bg-dark-500 py-4 text-sm rounded-lg hover:bg-dark-300">
                <div className="pl-4">{user.name} </div>
                <div className="text-center">{user.username}</div>
                <div className="text-center">{user.department ? user.department : "Visitor"}</div>
                <div className="text-center">{user.admin == true ? <div className='font-bold text-green-500'>Yes</div> : <div className='font-bold text-red-500'>No</div>}</div>
                <div className="text-center">{user.supervisor == true ? <div className='font-bold text-green-500'>Yes</div> : <div className='font-bold text-red-500'>No</div>}</div>
                <div className="text-center"><Link className='group-hover:bg-primary-500 group-hover:p-4 group-hover:px-6 group-hover:rounded-lg' href={`/settings/users/${user._id}`}>Edit</Link></div>
              </div>
            )
          })}

        </div>
      </div>

    </>
  )
}

export default UsersSettings;