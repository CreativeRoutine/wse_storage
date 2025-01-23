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
import { getSupplier } from '@/lib/actions/supplier.action'
import UpdateSuppliersName from '@/components/shared/suppliers/UpdateSuppliersName'
import DeleteSupplier from '@/components/shared/suppliers/DeleteSupplier'
import AddPalletToSupplier from '@/components/shared/suppliers/AddPalletToSupplier'

const page = async ({ params }: { params: { _id: string } }) => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const { _id } = params

  const supplierData = await getSupplier(_id)
  const supplier = JSON.parse(JSON.stringify(supplierData))
  
  // console.log(supplier)
  // console.log("CREATED")
  

  return (
    <>
      {
        supplier?.name ? ( <Title text={`Supplier - ${supplier.name}`} link="/settings/suppliers" linkText="Back" /> ) :
        (<Title text={`Supplier - ${supplier.ponumber}`} link="/settings/suppliers" linkText="Back" />)
      }
      

      <div className="flex flex-col bg-dark-600 rounded-xl border border-dark-350 p-4">
        {/* Top Side */}
        <div className="flex flex-row gap-4">

          {/* Feneral Info */}

          <div className='flex flex-col w-full lg:w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <Subheading className="!text-white !text-lg">General info</Subheading>
            <DescriptionList className='mt-4'>
              <DescriptionTerm className='text-white'>PO ID</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier._id}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Full name</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.name ? supplier.name : "Not set"}</DescriptionDetails>

              <DescriptionTerm>PO number</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.ponumber}</DescriptionDetails>

              <DescriptionTerm>Pallets</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.pallets ? supplier.pallets.length : "Not added yet"}</DescriptionDetails>

              <DescriptionTerm>Printers</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.printers ? supplier.printers.length : 0 }</DescriptionDetails>
            </DescriptionList>
          </div>

          {/* Actions */}

          <div className='flex flex-col justify-start items-start w-full lg:w-1/3 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <div className='flex flex-col gap-2 w-full'>
              <div className='bg-dark-600 rounded-xl border border-dark-350 p-4 '>
                <h3 className='text-white font-semibold mb-2'>Add / Change Supplier's name.</h3>
                <UpdateSuppliersName id={_id} />
              </div>
              <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
              <h3 className='text-white font-semibold mb-2'>Add pallet / Shipment.</h3>
                <AddPalletToSupplier id={_id} />
              </div>
              <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
                <h3 className='text-white font-semibold mb-2'>Delete Supplier.</h3>
                <h6 className='text-xs mb-2 text-slate-400'>You can delete Supplier if there are no pallets / printers inside.</h6>
                <DeleteSupplier id={_id} />
              </div>
            </div>
          </div>
        </div>

        {/* Botom Side */}

        <div className='flex flex-row gap-2'>
          {/* PALLETS */}
          <div className="flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg relative">Pallets / Shipments{supplier.pallets && supplier.pallets.length > 0 ? (<span className="text-sm text-slate-400 absolute right-2"> ({supplier.pallets.length})</span> ) : null }:</Subheading>
            
            {supplier.shipments && supplier.shipments.length > 0  ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        #
                      </th>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Barcode / Shipment
                      </th>
                      
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Printers
                      </th>
                      <th 
                        scope="col" 
                        className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                      >
                        Created on
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-transparent">
                    {supplier.shipments.map( 
                        (item:any, i:number) => (

                          <tr key={item._id} className='hover:bg-dark-300 rounded-lg hover:cursor-pointer'>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="text-white">{i+ 1 }</div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <div className="text-white"><Link href={`/supplier/pallet/${item._id}`}>{item.barcode}</Link></div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <div className="text-white"><Link href={`/supplier/pallet/${item._id}`}>{item.printers.length}</Link></div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500"><Link href={`/supplier/pallet/${item._id}`}>{formatTime(item.createdOn, "full")}</Link></td>
                            
                          </tr>
                        ))}
                  </tbody>
                </table>
                ) : (
                  <div className='text-red-400'>"Pallets have not been added yet"</div>
                )}
          </div>

          {/* PRINTERS  RIGHT SIDE*/}
          {/* <div className="flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg relative">
              Printers
              {supplier.printers && supplier.printers.length >= 1 && (
                <span className="text-sm text-slate-400 absolute right-2"> ({supplier.printers.length})</span>
              )}
            </Subheading>
              
            {supplier.printers && supplier.printers.length > 0  ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        #
                      </th>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        S/N
                      </th>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Barcode
                      </th>
                      <th 
                        scope="col" 
                        className=" py-3.5 pl-4 pr-3 text-left text-lg font-bold text-slate-100 sm:pl-0"
                      >
                        Product number
                      </th>
                      <th 
                        scope="col" 
                        className="px-3  py-3.5 text-left text-lg font-bold text-slate-100"
                      >
                        Created on
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-transparent">
                    {supplier.printers.map( 
                        (item:any, i:number) => (

                          <tr key={item._id}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="text-white">{i+ 1 }</div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <div className="text-white"><Link href={`/printers/${item._id}`}>{item.sn}</Link></div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <div className="text-white"><Link href={`/printers/${item._id}`}>{item.barcode}</Link></div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <div className="text-white"><Link href={`/printers/${item._id}`}>{item.productNumber}</Link></div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500"><Link href={`/printers/${item._id}`}>{formatTime(item.createdOn, "full")}</Link></td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                ) : (
                  <div className='text-red-400'>"Printers have not been added yet"</div>
                )}
          </div> */}

        </div>
      </div>
    </>
  )
}

export default page