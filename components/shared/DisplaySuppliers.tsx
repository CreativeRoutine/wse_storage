"use server"

import React from 'react'
import {formatTime} from "@/lib/utils";
import Link from "next/link";


interface Props {
  suppliers: any;
}

const DisplaySuppliers = async ({suppliers}:Props) => {
    
    if(suppliers.length == 0){
      return(<div className="mt-6 text-white text-left">"You didn't add any Supplier (PO number) yet!"</div>)
    }

  return (
    <>
      {suppliers.map((supplier:any) => (
        <tr key={supplier._id}>
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div className="ml-4">
                <div className="font-medium text-white">{supplier.ponumber}</div>
                
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{
                supplier.name ? (
                    <span className="inline-flex items-center  px-2 py-1 text-medium font-medium text-white ">
                  {supplier.name}
                </span>
                ) : (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                  Name not set
                </span>
                )
            }</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {
              supplier.pallets.length > 0  ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {supplier.pallets.length}
                </span>
              ) : (
              <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                No shipments yet
              </span>
            )
            }
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {
              supplier.printers && supplier.printers.length >= 1  ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {supplier.printers.length}
                </span>
              ) : (
              <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                No printers.
              </span>
            )
            }
          </td>
          {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{formatTime(supplier.createdOn, "full")}</td> */}
          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            <a href={`/supplier/${supplier._id}`} className="text-indigo-600 hover:text-indigo-900 z-0">
              View
            </a>
          </td>
        </tr>
      ))}
    </>
  )
}

export default DisplaySuppliers