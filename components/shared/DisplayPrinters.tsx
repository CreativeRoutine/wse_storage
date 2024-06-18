"use server"

// import React from 'react'
import {formatTime} from "@/lib/utils";
// import Link from "next/link";
import { getPrinters } from "@/lib/actions/printer.action";

interface Props {
  printers: any;
}

const DisplayPrinters = async ({printers}:Props) => {

  // console.log(typeof JSON.parse(JSON.stringify(printers[0])))

    // const resultPrinters = await getPrinters({})
    // const printers = JSON.parse(JSON.stringify(resultPrinters.printers))
    // console.log("===================== ",typeof printers)
    
    if(printers == 0){
      return(<div className="mt-6 text-white text-left">"You didn't add any printers yet!"</div>)
    }

  return (
    <>
      {printers.map((printer:any, i: any) => (
        <tr key={printer._id}>
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div>{i+1}</div>
              <div className="h-11 w-11 flex-shrink-0">
                <img className="h-11 w-11 rounded-full" src="/assets/printers_preview/281.png" alt="" />
              </div>
              <div className="ml-4">
                <div className="font-medium text-white">{printer.productNumber}</div>
                <div className="mt-1 text-gray-500">{printer.sn}</div>
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.ponumber ? printer.ponumber : <span className="text-red-500">Not set</span> }</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.barcode}</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {
              printer.tech.length > 0  ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  In progress
                </span>
              ) : (
              <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                Just added
              </span>
            )
            }
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{formatTime(printer.createdOn, "full")}</td>
          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            {/* <a href={`/printers/${printer.barcode}`} className="text-indigo-600 hover:text-indigo-900 z-0"> */}
            <a href={`/printers/${printer._id}`} className="text-indigo-600 hover:text-indigo-900 z-0">
              Edit
            </a>
          </td>
        </tr>
      ))}
    </>
  )
}

export default DisplayPrinters