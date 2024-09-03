import React from 'react'

import {auth} from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Title from "@/components/shared/Title";
import { getUserById } from '@/lib/actions/user.action'
import { ObjectId } from 'mongodb';
import {getUsers} from '@/lib/actions/user.action';
import {getEmployees} from '@/lib/actions/user.action';
import VisitorNotification from "@/components/shared/VisitorNotification";
import TechFormsComponent from '@/components/shared/TechFormsComponent';

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

  return (
    <>
      <Title text={"Work with printer"} />

      <div className="mt-4 bg-dark-600 rounded-xl  p-4 text-white">
        <div className="flex  flex-col rounded-lg flex flex-row gap-4 mt-4 w-full">

          <TechFormsComponent users={JSON.stringify(users)}/>

          </div>
      </div>  
    </>
  )
}

export default Printer;