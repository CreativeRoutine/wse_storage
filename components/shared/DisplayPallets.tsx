"use server"

import React from 'react'
import {formatTime} from "@/lib/utils";
import Link from "next/link";
import { getPallets } from "@/lib/actions/pallet.action";
import Image from 'next/image'
const DisplayPallets = async () => {

  const resultPallets = await getPallets({})
  const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))
  return (
    <>
      <div className="py-4 px-8 mb-2 mt-6 bg-dark-600 text-white rounded-xl flex-col items-center justify-between border border-dark-350 shadow-lg">
        <div className="w-full text-lg font-bold mb-4">
          Empty pallets.
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
                  
                  <Link href={`/storage/${pallet._id}`} className="flex rounded-lg bg-primary-500 text-white p-4 ml-auto">
                    Edit Pallet
                  </Link>
                  
                </div>
              )
            }
          })
        }
      </div>

      <div className="py-4 px-8 mb-2 mt-6 bg-dark-600 text-white rounded-xl flex-col items-center justify-between border border-dark-350 shadow-lg">

        <div className="w-full text-lg font-bold">
          Pallets filled.
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          {
          pallets.map((pallet:any) => {
            if(pallet.printers.length > 0){
              return(
                <div key={pallet._id} className="flex flex-wrap gap-2 max-w-1/3 bg-secondary-200 px-4 mb-2 py-6 rounded-xl border border-dark-350 shadow-lg">
                  
                  <div className='w-full pb-4 flex flex-row justify-between items-center border-b border-dark-400'>

                    <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                      <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="WH" src="/images/icons/warehouse.svg" className='invert' width={16} height={16} /></div>
                      <div className="font-normal text-xs text-white mx-4">{
                      pallet.location ? pallet.location : <div className="text-red-400">Not set</div>
                      }</div>
                    </div>

                    <Link href={`/storage/${pallet._id}`} className="flex justify-center items-center rounded-lg bg-primary-500 hover: text-white px-4 h-12">
                      Edit Pallet
                    </Link>

                  </div>

                  <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                    <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="printers" src="/images/icons/calendar.svg" className='invert' width={20} height={20} /></div>
                    <div className="font-normal text-xs text-white mx-4">{formatTime(pallet.createdOn, "date")}</div>
                  </div>

                  <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                    <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="printers" src="/images/icons/clock.svg" className='invert' width={20} height={20} /></div>
                    <div className="font-normal text-xs text-white mx-4">{formatTime(pallet.createdOn, "time")}</div>
                  </div>
                  
                  <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                    <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="printers" src="/images/icons/printer.svg" width={20} height={20} /></div>
                    <div className={`font-normal text-xs text-white mx-4 ${pallet.printers.length == 0 ? 'text-red-400' : 'text-white'}`}>{pallet.printers.length}</div>
                  </div>

                  <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                    <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="BC" src="/images/icons/barcode.svg" className='invert' width={20} height={20} /></div>
                    <div className="font-normal text-xs text-white mx-4">{pallet.barcode}</div>
                  </div>

                  <div className="rounded-full text-white flex flex-row items-center bg-dark-600">
                    <div className="p-4 bg-dark-400 rounded-full h-12 w-12"><Image alt="printers" src="/images/icons/address.svg" className='invert' width={20} height={20} /></div>
                    <div className="font-normal text-xs text-white mx-4">{pallet.ponumber}</div>
                  </div>

                  
                </div>
              )
            }
          })
          }
        </div>

      </div>
    </>
  )
}

export default DisplayPallets