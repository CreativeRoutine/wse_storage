"use server"

// import React from 'react'
import {formatTime} from "@/lib/utils";
// import Link from "next/link";
import { getPrinters } from "@/lib/actions/printer.action";

interface Props {
  printers: any;
  printersCount: number;
}

const DisplayPrinters = async ({printers, printersCount}:Props) => {
    
    if(printers == 0){
      return(<div className="mt-6 text-white text-left">"You didn't add any printers yet!"</div>)
    }

  return (
    <>
      {printers.map((printer:any, i: any) => (
        <tr key={printer._id}>
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div className="mr-2">{i+ 1 }.</div>
              <div className="h-11 w-11 flex-shrink-0">
                <img className="h-11 w-11 rounded-md" src={printer.preview ? printer.preview : "/assets/printers_preview/NoPreview.webp" } alt="" />
              </div>
              <div className="ml-4">
                <div className="font-medium text-white">P/N: {printer.productNumber}</div>
                <div className="mt-1 text-gray-500">S/N:{printer.sn}</div>
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.name ? printer.name : <span className="text-red-500">Not set</span> }</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.ponumber ? printer.ponumber : <span className="text-red-500">Not set</span> }</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{printer.barcode}</div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              {
                // Проверяем, существует ли tasksPerformed и есть ли в нем элементы
                printer.tasksPerformed && printer.tasksPerformed.length > 0 ? (
                    
                    printer.tasksPerformed[printer.tasksPerformed.length - 1].status === "Refurbished" ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {printer.tasksPerformed[printer.tasksPerformed.length - 1].status}
                      </span>
                    ) :  (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        {printer.tasksPerformed[printer.tasksPerformed.length - 1].status}
                      </span>
                    )
                  
                ) : (
                  // Если нет выполненных заданий, показываем, что только добавлено
                  <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                    Just added
                  </span>
                )
              }
            </td>
          {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {
              
              printer.tech && printer.tech.length > 0  ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  In progress
                </span>
              ) : (
              <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                Just added
              </span>
            )
            }
          </td> */}
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