"use client"
import React, {useState} from 'react'

import Title from "@/components/shared/Title";

import RefurbishPrinter from '@/components/shared/printers/RefurbishPrinter';
import {getUsers} from '@/lib/actions/user.action';
import AddColumnForm from '@/components/shared/AddColumnForm';

const Printer = () => {

  const [formActive, setFormActive ] = useState(false);
  
  return (
    <>
      <Title text={"Work with printer"} />

      <div className="mt-4 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className="rounded-lg flex flex-row gap-4 mb-4 justify-end w-full">
          <AddColumnForm columnState={setFormActive} formActive={formActive}/>
        </div>
        <div className=" rounded-lg flex flex-row gap-4">
          <div className="p-2 flex w-full items-center space-x-2">
            <RefurbishPrinter />
          </div>

          
          <div className={`${formActive ? "flex" : "hidden"} p-2 flex w-full items-center space-x-2`}>
            <RefurbishPrinter />
          </div>
          

          
        </div>
      </div>  
    </>
  )
}

export default Printer;