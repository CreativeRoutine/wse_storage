import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/tw/description-list'
import { Subheading } from '@/components/tw/heading'
import Title from '@/components/shared/Title' 
import React from 'react'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"

import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { formatTime } from '@/lib/utils'
import { getMakeById } from '@/lib/actions/makes.action'

import DeleteMake from '@/components/shared/make/DeleteMake'
import UpdateMakeName from '@/components/shared/make/UpdateMakeName'

const page = async ({ params }: { params: { _id: string } }) => {

  const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
  ]

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { _id } = params

  const makeData = await getMakeById({_id})
  const make = JSON.parse(JSON.stringify(makeData))
  // console.log(make)

  return (

    <>
      {
        make.name ? ( <Title text={`Make - ${make.name}`} /> ) :
        (<Title text={`Make - ${_id}`} />)
      }
      

      <div className="flex flex-col bg-dark-600 rounded-xl border border-dark-350 p-4">

        {/* =========== */}
        {/*   TOP Side  */}
        {/* =========== */}
        <div className="flex flex-row gap-2">
          <div className='flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <Subheading className="!text-white !text-lg">General info</Subheading>
            <DescriptionList className='mt-4'>

              <DescriptionTerm className='text-white'>Make's name:</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{make.name ? make.name : "Not set"}</DescriptionDetails>

              <DescriptionTerm>Product number:</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{make.productNumber}</DescriptionDetails>


              <DescriptionTerm>Printers qtty:</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{make.printers ? make.printers.length : 0 }</DescriptionDetails>
            </DescriptionList>
          </div>

          <div className='flex flex-col justify-center align-center items-center w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <div>
            <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
              <UpdateMakeName id={_id} />
            </div>
            <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
              <DeleteMake id={_id} />
            </div>
            </div>
              
          </div>
        </div>

        {/* =========== */}
        {/* Botom Side */}
        {/* =========== */}

        <div className='flex flex-row gap-2'>
          

          <div className="flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg relative">Printers{make.printers && make.printers.length >= 1 ? (<span className="text-sm text-slate-400 absolute right-2"> ({make.printers.length})</span> ) : null }:</Subheading>
            
            <div className="px-4 sm:px-6 lg:px-4 ">
              {
                make.printers && make.printers.length > 0  ? (
                  <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-2">
                        <table className="min-w-full divide-y divide-gray-600">
                          <thead>
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-light-800 sm:pl-3">
                                #
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-light-800">
                                Barcode:
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-light-800">
                                Added on:
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-light-800">
                                S/n:
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                <span className="sr-only">View</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="">
                            {
                              make.printers.map( 
                                (item:any, i:number) => (
                                  <>
                                    <tr key={item._id} className="even:bg-secondary-100 rounded-lg even:rounded-xl">
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-dark-400 sm:pl-3">
                                        {i+1}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-light-400">{item.barcode}</td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-light-400">{formatTime( item.createdOn, "date")}</td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-light-400">{item.sn}</td>
                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                        <Link className='text-indigo-600 hover:text-indigo-900' href={`/printers/${item._id}`}>View</Link>
                                      </td>
                                    </tr>                 
                                  </>
                                )
                              )
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='px-2 mt-4 text-red-400'>"All Printers this model were deleted, but info about this Make still in our Database."</div>
                )
              }
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default page