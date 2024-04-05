"use client"

import React, {useState} from 'react'
import { Button } from "@/components/ui/button";
import { deletePrinterModel } from '@/lib/actions/printer.action';1234
import { usePathname} from 'next/navigation';


const LastPrinters = ({printers}:any) => {
  const usepathname = usePathname();
  
  const handleDelete = async (printerId: any) => {
  
    try {
      await deletePrinterModel({printerId, path: usepathname,}); // Call the deletePrinter function with the printerId
      // After successful deletion, you might want to update the list of printers displayed on the UI.
      // You can do this by fetching the updated list of printers again or updating the state if you're managing it locally.
      
    } catch (error) {
      console.error("Error deleting printer:", error);
    }
  };

  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
      <div className="mb-4">
        <div className="mb-3 pl-4 text-lg text-slate-300 font-semibold">List of Printers:</div>
        <div className="">
          <ul className="w-full">
          <li className="group flex flex-row justify-between items-center rounded-xl bg-dark-200 text-white font-semibold p-4">
            <span className='w-1/3 flex justify-start'>Make / Model</span>
            <span className='w-1/3 flex justify-center'>Product num.</span>
            <span className='w-1/3 flex justify-end'>Action</span>
          </li>
            {printers.map((printer: any) => (

              <li key={printer._id} className="group flex flex-row justify-between items-center rounded-xl hover:bg-dark-200 p-2">
                <span className="w-[90px] pl-2 text-slate-500 group-hover:text-slate-300">{printer.make} {printer.pModel.toUpperCase()}</span>
                <span className='text-slate-500 group-hover:text-slate-300'>{printer.pnum}</span>
                <Button type="submit" className="p-2 text-slate-600 group-hover:bg-red-500 group-hover:text-white p-2 rounded-xl" onClick={() => handleDelete(printer._id)}>
                  Edit printer
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LastPrinters