"use client"

import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deletePallet } from '@/lib/actions/pallet.action';
import { usePathname} from 'next/navigation';

const LastPallets = ({pallets}:any) => {

  console.log("Pallets: ", pallets)
  const usepathname = usePathname();
  const handleDelete = async (palletId: any) => {
    try {
      await deletePallet({palletId, path: usepathname,}); // Call the deletePrinter function with the printerId
      // After successful deletion, you might want to update the list of printers displayed on the UI.
      // You can do this by fetching the updated list of printers again or updating the state if you're managing it locally.
      
    } catch (error) {
      console.error("Error deleting pallet:", error);
    }
  };

  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
      <div className="mb-4">
        <div className="mb-3 pl-4 text-lg text-slate-300 font-semibold">List of recen pallets:</div>
        <div className="">
          <ul className="w-full">
          <li className="group flex flex-row justify-between items-center rounded-xl bg-dark-200 text-white font-semibold p-4">
            <span className='w-1/3 flex justify-start'>S/N</span>
            <span className='w-1/3 flex justify-center'>Place.</span>
            <span className='w-1/3 flex justify-end'>Action</span>
          </li>
            {pallets.map((pallet: any) => (

              <li key={pallet._id} className="group flex flex-row justify-between items-center rounded-xl hover:bg-dark-200 p-2">
                <span className="w-[90px] pl-2 text-slate-500 group-hover:text-slate-300">{pallet.sn}</span>
                <span className='text-slate-500 group-hover:text-slate-300'>{pallet.locker}</span>
                <Button type="submit" className="p-2 text-slate-600 group-hover:bg-red-500 group-hover:text-white p-2 rounded-xl" onClick={() => handleDelete(pallet._id)}>
                  Edit pallet
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">
      <div className="mb-3 text-lg text-slate-300 font-semibold">Latest Pallets added:</div>
      <div className="">
        <ul className="w-full">
          <li className="group flex flex-row justify-between items-center rounded-xl hover:bg-dark-200 p-2">
            <span className="text-slate-500 group-hover:text-slate-300">SN123456PN</span>
            <Button className="p-2">
              <Link href="/" className="group-hover:bg-primary-500 text-white p-2 rounded-xl">Edit pallet</Link>
            </Button>
          </li>
          <li className="group flex flex-row justify-between items-center rounded-xl text-slate-300 hover:bg-dark-200 p-2">
            <span className="text-slate-500 group-hover:text-slate-300">SN654321PN</span>
            <Button className="p-2">
              <Link href="/" className="group-hover:bg-primary-500 text-white p-2 rounded-xl">Edit pallet</Link>
            </Button>
          </li>
          <li className="group flex flex-row justify-between items-center rounded-xl text-slate-300 hover:bg-dark-200 p-2">
            <span className="text-slate-500 group-hover:text-slate-300">SN456456PN</span>
            <Button className="p-2">
              <Link href="/" className="group-hover:bg-primary-500 text-white p-2 rounded-xl">Edit pallet</Link>
            </Button>
          </li>

        </ul>
      </div>
    </div>
  )

}

export default LastPallets