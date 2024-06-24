import React, { Key} from "react";

import Title from "@/components/shared/Title";
import {auth} from "@clerk/nextjs"
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from "@/components/shared/VisitorNotification";
import DisplayPrinters from "@/components/shared/DisplayPrinters";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { SearchParamsProps } from "@/types";
import { getPrinters } from "@/lib/actions/printer.action";
import {PrintersFilters} from "@/components/printers/PrintersFilters";

const Printers = async ({searchParams}: SearchParamsProps) => {


  const result = await getPrinters({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  return (
    <>
        <Title text="Printers page" />



  
        {/* LIST OF PRINTERS */}
        <div className="mt-4 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
          <div className="px-4 sm:px-6 lg:px-8 rounded-lg">

            <div className="sticky mt-8 flow-root  rounded-lg">
              <LocalSearchbar 
                route="/printers" 
                iconPosition="left" 
                imgSrc="/assets/icons/search.svg" 
                placeholder="Search by product number, serial number, PO number or barcode" 
                otherClasses="mb-4 bg-dark-600"
              /> 
            </div>
            <PrintersFilters />

            <div className="mt-8 flow-root  rounded-lg">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th 
                          scope="col" 
                          className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                        >
                          Printer
                        </th>
                        <th 
                          scope="col" 
                          className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                        >
                          PO number
                        </th>
                        <th 
                          scope="col" 
                          className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                        >
                          Barcode
                        </th>
                        <th 
                          scope="col" 
                          className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                        >
                          Status
                        </th>
                        <th 
                          scope="col" 
                          className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                        >
                          Created on
                        </th>
                        <th 
                          scope="col" 
                          className="relative  py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only hidden">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-transparent">
                      <DisplayPrinters 
                        // printers={valuesArray[0]} 
                        printers={result.printers} 
                        printersCount={searchParams?.page ? +searchParams.page : 1}
                      />
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>  

        <Pagination 
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />

        
      </>
  )

}

export default Printers;