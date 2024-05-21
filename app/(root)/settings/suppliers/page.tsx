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
import {Button} from "@/components/ui/button";
import SettingsNav from "@/components/shared/SettingsNav";
import DisplaySuppliers from "@/components/shared/DisplaySuppliers";

const Suppliers = async () => {
    const {userId} = auth();
    if(!userId) redirect('/sign-in')
      const mongoUserData = await getUserById({userId})
    const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
    
    if(mongoUser.department === "visitor" ){
      return(<VisitorNotification />)
    }

    return (
    <>
        <Title text="Settings page" />

        <div className="flex items-center justify-between text-white">
          <SettingsNav />
        </div>
  
        {/* LIST OF PRINTERS */}
        <div className="mt-8 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
          <div className="px-4 sm:px-6 lg:px-8 rounded-lg">
            

            <div className="mt-8 flow-root  rounded-lg">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th 
                          scope="col" 
                          className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                        >
                          Supplier PON
                        </th>
                        <th 
                          scope="col" 
                          className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                        >
                          Name
                        </th>
                        <th 
                          scope="col" 
                          className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                        >
                          Pallets qtty
                        </th>
                        <th 
                          scope="col" 
                          className="relative  py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only hidden">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-transparent">
                      <DisplaySuppliers />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </>
  )
}

export default Suppliers