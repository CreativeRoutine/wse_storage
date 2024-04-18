"use server"

import React from 'react'
import {formatTime} from "@/lib/utils";
import Link from "next/link";
import { getPallets } from "@/lib/actions/pallet.action";

const DisplayPallets = async () => {

    const resultPallets = await getPallets({})
    const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))
  return (
    <>
    <div className="py-4 px-8 mb-2 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
      <div className="w-full text-lg">
        Pallets without printers.
      </div>
    </div>
    {
      pallets.map((pallet:any) => {
        if(pallet.printers.length == 0){
          return(
            <div key={pallet._id} className="flex flex-row bg-secondary-200 px-6 mb-2 py-4 rounded-xl border border-dark-350 shadow-lg">
              <div className="flex items-center text-white mr-[24px]">
                <div className="font-normal pr-2 text-slate-400">Created on: </div>
                <div className="font-normal text-white">{formatTime(pallet.createdOn, "date")}</div>
              </div>
              <div className="flex items-center text-white mr-[24px]">
                <div className="font-normal pr-2 text-slate-400">At: </div>
                <div className="font-bold text-white">{formatTime(pallet.createdOn, "time")}</div>
              </div>
              <div className="flex items-center text-white mr-[24px]">
                <div className="font-normal pr-2 text-slate-400">Barcode: </div>
                <div className="font-bold text-white">{pallet.barcode}</div>
              </div>
              <div className="flex items-center text-white mr-[24px]">
                <div className="font-normal pr-2 text-slate-400">PO number: </div>
                <div className="font-bold text-white">{pallet.ponumber}</div>
              </div>
              <div className="flex items-center text-white mr-[24px]">
                <div className="font-normal pr-2 text-slate-400">Printers inside: </div>
                <div className={`font-bold ${pallet.printers.length == 0 ? 'text-red-400' : 'text-white'}`}>{pallet.printers.length}</div>
              </div>
              
              <Link href={`/storage/${pallet.barcode}`} className="flex rounded-lg bg-primary-500 text-white p-4 ml-auto">
                Edit Pallet
              </Link>
              
            </div>
          )
        }
      })
    }
    <div className="py-4 px-8 mb-2 mt-6 bg-dark-600 text-white rounded-xl flex items-center justify-between border border-dark-350 shadow-lg">
      <div className="w-full text-lg">
        Full pallets.
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">
        {
          pallets ? (
            pallets.map((pallet:any) => {
              if(pallet.printers.length > 0){
                return(
                  <div key={pallet._id} className="flex flex-col basis-1/3 ma-w-1/3 bg-secondary-200 px-6 mb-2 py-8 rounded-xl border border-dark-350 shadow-lg">
                    <div className="flex justify-between w-full text-white mb-3">
                      <div className="font-semibold">Locaion:</div>
                      <div className="font-bold text-lime-400">{pallet.location}</div>
                    </div>
                    <div className="flex justify-between w-full text-white mb-3">
                      <div className="font-semibold">Created on:</div>
                      <div className="font-normal text-white">{formatTime(pallet.createdOn, "date")}</div>
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
            })
          ) : (
            <div className='text-lg text-white'>No data to show</div>
          )
        }
      </div>
    </>
  )
}

export default DisplayPallets