import React from 'react'
import Image from 'next/image'

const VisitorNotification = () => {
  return (
    <>
      <div className="py-8 px-8 mb-8 bg-dark-600 text-white rounded-xl  border border-dark-350 shadow-lg">
        <h1 className="text-2xl font-semibold flex justify-center items-center pt-6">You are not authorized to view this page. Wait till Admin action!</h1>
        <div className="grid justify-items-stretch mt-12">
          <Image src="/assets/logo.png" width={320} height={320} alt="lock" className=" justify-self-center"/>
        </div>
      </div>
    </>
  )
}

export default VisitorNotification