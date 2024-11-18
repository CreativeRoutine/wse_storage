import React, { Key} from "react";
import Title from "@/components/shared/Title";
import {auth} from "@clerk/nextjs"
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
import { getAllPartsList } from "@/lib/actions/partsList.action";
import AddPartNameToList from "@/components/shared/parts/AddPartNameToList";
import RenamePartInList from "@/components/shared/parts/RenamePartInList";
import DeletePartNameFromList from "@/components/shared/parts/DeletePartNameFromList";

const PartsList = async ({searchParams}: SearchParamsProps) => {

  
  const {userId} = auth();
  if(!userId) redirect('/sign-in')


  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor" ){
    return(<VisitorNotification />)
  }
  
  const result = await getAllPartsList()

  console.log(result)

  return (
    <>
        <Title text="Settings page" />

        <div className="flex items-center justify-between text-white">
          <SettingsNav />
        </div>
  
        {/* LIST OF MAKES */}
        <div className="mt-8 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
          <div className="px- sm:px-6 lg:px-4 rounded-lg">            

          <div className="mt-2 flow-root  rounded-lg">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="min-w-full py-0 align-middle sm:px-2 lg:px-4 flex gap-2">
                {/* LEFT SIDE */}
                <div className="bg-secondary-200 px-6 mb-1 py-4 w-1/2 rounded-xl border border-dark-350 shadow-lg">
                  <div className="text-white text-base font-semibold border-b border-slate-900 pb-2 mb-4">
                    Parts name:
                  </div>  
                        
                  <ul>
                    {result && result.partName.map((part: any, index: Key) => (
                      <li key={index} className="odd:bg-transparent even:bg-secondary-100 p-3 rounded-xl group flex justify-between">
                        <div>
                          <span className="text-sm text-slate-300 pr-3">{Number(index) + 1}.</span>
                          <span className="font-semibold text-md tracking-wider">{part}</span>
                        </div>
                        <div className="flex gap-2">
                          {/* Delete */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-auto bg-red-500 text-white hidden group-hover:flex py-0 h-6 text-xs hover:bg-red-700">
                                Delete part
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md bg-dark-100 border-0">
                              <DialogHeader>
                                <DialogTitle className="text-white mb-2">Delete part</DialogTitle>
                                <DialogDescription className="invisible h-0">
                                  Make sure this part not needed.
                                </DialogDescription>
                                </DialogHeader>
                                  
                                  <DeletePartNameFromList oldPartName={part}/>

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
                         {/*Rename  */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-auto bg-green-500 text-white hidden group-hover:flex py-0 h-6 text-xs hover:bg-green-700">
                              Rename part
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-md bg-dark-100 border-0">
                            <DialogHeader>
                              <DialogTitle className="text-white mb-2">Rename part</DialogTitle>
                              <DialogDescription className="invisible h-0">
                                Make sure to rename the part correctly.
                              </DialogDescription>
                              </DialogHeader>
                                
                                <RenamePartInList oldPartName={part}/>

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
                      </li>
                    ))}

                  </ul>

                </div>
                {/* RIGHT SIDE */}
                <div className="bg-secondary-200 px-6 mb-1 py-4 w-1/2 rounded-xl border border-dark-350 shadow-lg">
                  <AddPartNameToList mongoUserId={mongoUser._id} />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>  
      </>
  )
}

export default PartsList