import React from 'react'

import {auth} from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Title from "@/components/shared/Title";
import { getUserById } from '@/lib/actions/user.action'
import { ObjectId } from 'mongodb';
import {getUsers} from '@/lib/actions/user.action';
import {getEmployees} from '@/lib/actions/user.action';
import VisitorNotification from "@/components/shared/VisitorNotification";

import { getPrinterById } from '@/lib/actions/printer.action';
import { getAllPartsModels } from '@/lib/actions/parts.action';
import TechsForm from '@/components/shared/TechsForm';
import TechsWorkForm from '@/components/shared/workForms/TechWorkForm';

const Printer = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))

  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const getMyUsers = await getEmployees({});
  const myUsers = getMyUsers.users
  const users = myUsers.filter((user: { department: string; }) => user.department === "tech").map((user: { _id: ObjectId; name: any; }):any => ({
    id: (user._id as ObjectId).toString(), // Преобразуем ObjectId в строку
    name: user.name,
  }));

  const userList = JSON.parse(JSON.stringify(users))

  const getMyParts = await getAllPartsModels({});
  const parts = JSON.parse(JSON.stringify(getMyParts))



  return (
    <>
      <Title text={"Work with printer"} />

      <div className="-mt-4 bg-dark-600 rounded-xl  p-4 text-white">
        <div className="flex  flex-col lg:flex-row rounded-lg  gap-4 mt-4 w-full">
          


        <div className='w-full lg:w-1/2'>
          <TechsWorkForm  
            users={userList} 
            partsList={parts}
          />
        </div>
        <div className='w-full lg:w-1/2'>
          <TechsWorkForm  
            users={userList} 
            partsList={parts}
          />
        </div>
          

          </div>
      </div>  
    </>
  )
}

export default Printer;