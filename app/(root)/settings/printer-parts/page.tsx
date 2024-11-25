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
import DisplayParts from "@/components/shared/DisplayParts";
import {Button} from "@/components/ui/button";
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
import SettingsNav from "@/components/shared/SettingsNav";
import { SearchParamsProps } from "@/types";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { getAllParts } from "@/lib/actions/parts.action";
import CreatePart from "@/components/shared/parts/CreatePart";
import AddPartNameToList from "@/components/shared/parts/AddPartNameToList";

const PrinterParts = async ({searchParams}: SearchParamsProps) => {

  const result = await getAllParts({
    searchQuery: searchParams.q
  })
  
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
          
          <div className="flex gap-2">
            {/* Create printer part */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-auto bg-primary-500 text-white">
                  Create printer's part
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-dark-100 border-0">
                <DialogHeader>
                  <DialogTitle className="text-white mb-2">Create partition for new printer's parts</DialogTitle>
                  <DialogDescription className="text-white text-sm">
                    Make sure you adding printer model not existing in the database.
                  </DialogDescription>
                  </DialogHeader>
                    {/* <div className="w-full flex flex-col bg-secondary-200 px-6 mb-2 pt-6 pb-6 rounded-xl border border-dark-350 shadow-lg gap-4"> */}
                      <CreatePart mongoUserId={mongoUser._id} />
                    {/* </div> */}
                  <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" className="text-white border border-slate-500" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>


          </div>

        </div>
  
        {/* LIST OF MAKES */}
        <div className="mt-8 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
          <div className="px-4 sm:px-6 lg:px-8 rounded-lg">

          {/* LOCAL SEARCHBAR */}
          {/* <div className="sticky mt-8 flow-root  rounded-lg">
            <LocalSearchbar 
              route="/settings/printer-parts" 
              iconPosition="left" 
              imgSrc="/assets/icons/search.svg" 
              placeholder="Filter by makes's name or product number" 
              otherClasses="mb-4 bg-dark-600"
            /> 
          </div> */}

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
                        Printer
                      </th>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Printer make
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
                        Parts list
                      </th>

                      {/* <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Parts max qtty
                      </th> */}

                      <th 
                        scope="col" 
                        className="relative  py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only hidden">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-transparent">
                    <DisplayParts parts={result}/>
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

export default PrinterParts