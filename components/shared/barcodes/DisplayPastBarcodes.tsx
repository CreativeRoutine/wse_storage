import React from 'react'

interface Props {
    barcodes: any;
}

export default function DisplayPastBarcodes ({barcodes}:Props) {

    const results = barcodes;
    // console.log("RESULTS",results)

  return (
        <div className='bg-dark-300 py-6 px-4 mb-4 rounded-lg text-white w-full'>
            <div className='text-xl mb-2  font-semibold'>Last barcodes inputs:</div>
            <div className=' flex flex-row justify-between w-full'>
                <div className='text-normal mb-2 text-slate-200'>Printers (WSE-P): <span className='ml-3 text-white font-semibold'>{results || results?.printers ? results.printers : <span className='text-red-500'>0</span> }</span></div>
                <div className='text-normal mb-2 text-slate-200'>Parts (WSE-PP): <span className='ml-3 text-white font-semibold'>{results || results?.parts ? results.parts : <span className='text-red-500'>0</span> }</span></div>
                <div className='text-normal mb-2 text-slate-200'>Pallets (WSE-P): <span className='ml-3 text-white font-semibold'>{results || results?.pallets ? results.pallets : <span className='text-red-500'>0</span> }</span></div>
                <div className='text-normal mb-2 text-slate-200'>Storage (WSE-ST): <span className='ml-3 text-white font-semibold'>{results || results?.storage ? results.storage : <span className='text-red-500'>Not set</span> }</span></div>

            </div>
        </div>

  )
}
