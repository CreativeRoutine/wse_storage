"use client"

import React, {useState} from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image'


interface Props {
  columnState: any;
  formActive: any;
}

const AddColumnForm = ({columnState, formActive}:Props) => {

  
  const handleSearchPrinter = ()=>{

    columnState(!formActive)
  }

  return (
    <Button 
      className=' flex items-center border border-white justify-center gap-4 p-2 w-[40px] h-[40px] lg:p-4 sm:p-0  lg:h-[60px] lg:w-auto lg:justify-start'
      onClick={handleSearchPrinter} 
    >
      
      <Image
        src={ !formActive == true ? ("/assets/icons/plus.svg") : ("/assets/icons/close.svg") }
        alt="arrow"
        width={20}
        height={20}
        className={ !formActive == true ? "" : "invert"}
      />
      { !formActive == true ? "Add User's form" : "Delete User's form" }
    </Button>
  )
}

export default AddColumnForm