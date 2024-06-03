"use server"

import React from 'react'
import Link from "next/link";
import Image from 'next/image'
import { getAllMakes } from "@/lib/actions/makes.action";

const DisplayMakes = async () => {

    const makesRaw = await getAllMakes({})
    const makes = JSON.parse(JSON.stringify(makesRaw))
    console.log(makes)
    // const suppliers = JSON.parse(JSON.stringify(makes.suppliers))
    if(makes.length == 0){
      return(<div className="mt-6 text-white text-left">"You didn't add any Makes (Priner's names) yet!"</div>)
    }

  return (
    <>
      {makes.map((make:any) => (
        <tr key={make._id}>
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div className="ml-4">
                <div className="font-medium text-white">{
                    make.preview ? <Image src={make.preview} width={48} height={48} alt="printer"/> : <Image src="/images/no_preview.png" width={48} height={48} alt="preview" />
                }</div>
                
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
            <div className="flex items-center">
              <div className="ml-4">
                <div className="font-medium text-white">{make.productNumber}</div>
                
              </div>
            </div>
          </td>
          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div className="text-white">{
                make.name ? (
                    <span className="inline-flex items-center  px-2 py-1 text-medium font-medium text-white ">
                  {make.name}
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
              make.printers.length > 0  ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {make.printers.length}
                </span>
              ) : (
              <span className="inline-flex items-center rounded-md bg-grey-50 px-2 py-1 text-xs font-medium text-grey-700 ring-2 ring-current ring-inset">
                No printers.
              </span>
            )
            }
          </td>
          {/* <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{formatTime(make.createdOn, "full")}</td> */}
          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
            <a href={`/make/${make._id}`} className="text-indigo-600 hover:text-indigo-900 z-0">
              View
            </a>
          </td>
        </tr>
      ))}
    </>
  )
}

export default DisplayMakes