"use server"

import React from 'react'
import {formatTime} from "@/lib/utils";
import Link from "next/link";
import { getPallets } from "@/lib/actions/pallet.action";

const DisplayPallets = async () => {

    const resultPallets = await getPallets({})
    const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))
    // console.log(JSON.parse(JSON.stringify(pallets)))
  return (
    <div className="grid grid-cols-3 gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">
        {
          pallets ? (
            pallets.map((pallet:any) => {
              return(
                <div key={pallet._id} className="flex flex-col basis-1/3 ma-w-1/3 bg-secondary-200 px-6 mb-2 py-8 rounded-xl border border-dark-350 shadow-lg">
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-semibold">Created on:</div>
                    <div className="font-bold text-lime-400">{formatTime(pallet.createdOn, "date")}</div>
                  </div>
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-semibold">At:</div>
                    <div className="font-bold text-white">{formatTime(pallet.createdOn, "time")}</div>
                  </div>
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-semibold">Barcode</div>
                    <div className="font-bold text-white">{pallet.barcode}</div>
                  </div>
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-semibold">PO number</div>
                    <div className="font-bold text-white">{pallet.ponumber}</div>
                  </div>
                  <div className="flex justify-between w-full text-white mb-3">
                    <div className="font-semibold">Printers inside</div>
                    <div className={`font-bold ${pallet.printers.length == 0 ? 'text-red-400' : 'text-white'}`}>{pallet.printers.length}</div>
                  </div>
                  
                  <Link href={`/storage/${pallet.barcode}`} className="flex justify-center items-center rounded-lg bg-primary-500 text-white mt-3 p-4">
                    Edit Pallet
                  </Link>
                </div>
              )
            }
          )
          ) : (
            <div>No data to show</div>
          )
        }
      </div>
  )
}

export default DisplayPallets