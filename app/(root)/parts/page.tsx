import React from 'react'

import {auth} from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Title from "@/components/shared/Title";
import { getUserById } from '@/lib/actions/user.action'
import { ObjectId } from 'mongodb';
import {getUsers} from '@/lib/actions/user.action';
import {getEmployees} from '@/lib/actions/user.action';
import VisitorNotification from "@/components/shared/VisitorNotification";
import { getAllPartsSimple } from '@/lib/actions/parts.action';
import DisplayAllParts from '@/components/shared/DisplayAllParts';

const PartsPage = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const getMyUsers = await getEmployees({});

  const myUsers = getMyUsers.users

  const getParts = await getAllPartsSimple()
  const parts = JSON.parse(JSON.stringify(getParts))

  // console.log("getParts ===>",parts)
  

  const users = myUsers.filter((user: { department: string; }) => user.department === "tech").map((user: { _id: ObjectId; name: any; }):any => ({
    id: (user._id as ObjectId).toString(), // Преобразуем ObjectId в строку
    name: user.name,
  }));

  return (
    <>
      <Title text={"Parts"} />
      <div className="mt-4 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className="px-4 sm:px-6 lg:px-8 rounded-lg">
      {/* TABLE */}
          <div className="mt-8 flow-root rounded-lg">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="">
                    <tr>

                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Make
                      </th>

                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Product number
                      </th>

                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Part name
                      </th>

                      <th 
                        scope="col" 
                        className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                      >
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-transparent">
                    <DisplayAllParts parts={parts}/>
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>

      {/* <div className="mt-4 bg-dark-600 rounded-xl  p-4 text-white">
        <div className="flex  flex-col rounded-lg lg:flex-row gap-4 mt-4 min-w-full">

        <div className="mt-2 flow-root w-full rounded-lg">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <DisplayAllParts parts={parts}/>
              </div>
            </div>
          </div>

          </div>
      </div>   */}
    </div>
    </div>
    </>
  )
}

export default PartsPage;