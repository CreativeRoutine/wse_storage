import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/tw/description-list'
import { Subheading } from '@/components/tw/heading'
import Title from '@/components/shared/Title' 
import { getPrinterPopulated } from '@/lib/actions/printer.action'
import { getPaletById } from '@/lib/actions/pallet.action'
import React from 'react'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {auth} from "@clerk/nextjs"

import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from '@/components/shared/VisitorNotification'
import { formatTime } from '@/lib/utils'
import { getSupplier } from '@/lib/actions/supplier.action'
import UpdatePalet from '@/components/shared/pallets/UpdatePalet'
import UpdateSuppliersName from '@/components/shared/suppliers/UpdateSuppliersName'
import DeleteSupplier from '@/components/shared/suppliers/DeleteSupplier'

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
  const pallets = JSON.parse(JSON.stringify(supplier.pallets))
  // console.log(supplier)

  return (
    
    <>
      {
        supplier.name ? ( <Title text={`Supplier - ${supplier.name}`} /> ) :
        (<Title text={`Supplier - ${_id}`} />)
      }
      

      <div className="flex flex-col bg-dark-600 rounded-xl border border-dark-350 p-4">
        <div className="flex flex-row gap-2">
          <div className='flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <Subheading className="!text-white !text-lg">General info</Subheading>
            <DescriptionList className='mt-4'>
            <DescriptionTerm className='text-white'>PO ID</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier._id}</DescriptionDetails>

              <DescriptionTerm className='text-white'>Full name</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.name ? supplier.name : "Not set"}</DescriptionDetails>

              <DescriptionTerm>PO number</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.ponumber}</DescriptionDetails>

              <DescriptionTerm>Pallets</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{pallets.length}</DescriptionDetails>

              <DescriptionTerm>Printers</DescriptionTerm>
              <DescriptionDetails className='!text-white'>{supplier.printers ? supplier.printers.length : 0 }</DescriptionDetails>
            </DescriptionList>
          </div>
          <div className='flex flex-col justify-center align-center items-center w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg'>
            <div>
            <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
              <UpdateSuppliersName id={_id} />
            </div>
            <div className='bg-dark-600 rounded-xl border border-dark-350 p-4'>
              <DeleteSupplier id={_id} />
            </div>
            </div>
              
          </div>
        </div>

        {/* Botom Side */}

        <div className='flex flex-row gap-2'>
          <div className="flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg relative">Pallets{pallets.length > 0 ? (<span className="text-sm text-slate-400 absolute right-2"> ({pallets.length})</span> ) : null }:</Subheading>
            <DescriptionList className='mt-4'>

          {
            pallets.length > 0 ?

              pallets.map( 
                (item:any, i:number) => (
                  <>
                    <DescriptionTerm className='text-white'>{i + 1}</DescriptionTerm>
                    <DescriptionDetails className='!text-white'><Link href={`/storage/${item}`}>{item}</Link></DescriptionDetails>                  
                  </>
                    )
              ) : (
                <div className='text-red-400'>"Pallets have not been added yet"</div>
              )
            } 
            
              
              </DescriptionList>

          </div>

          <div className="flex flex-col w-1/2 max-w-1/2 bg-secondary-200 px-6 mb-2 pt-8 pb-6 rounded-xl border border-dark-350 shadow-lg">
            <Subheading className="!text-white !text-lg relative">Printers{supplier.printers && supplier.printers.length >= 1 ? (<span className="text-sm text-slate-400 absolute right-2"> ({supplier.printers.length})</span> ) : null }:</Subheading>
            <DescriptionList className='mt-4'>

              {
                supplier.printers.length > 0  ?
                supplier.printers.map( 
                  (item:any, i:number) => (
                    <>
                      <DescriptionTerm className='text-white'>{i + 1}</DescriptionTerm>
                      <DescriptionDetails className='!text-white'><Link href={`/printers/${item}`}>{item}</Link></DescriptionDetails>                  
                    </>
                      )
                    ) : (
                      <div className='text-red-400'>"Printers have not been added yet"</div>
                    )
              }
              </DescriptionList>

          </div>
        </div>

      </div>
    </>
  )
}

export default page