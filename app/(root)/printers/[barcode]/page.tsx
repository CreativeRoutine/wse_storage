
import React, {Key} from 'react'
import Title from '@/components/shared/Title'
import { getPrinter } from '@/lib/actions/printer.action'


const page = async ({ params }: { params: { barcode: string } }) => {

    const barcode = params.barcode;

    const printer = await getPrinter({ barcode });


  return (
    <>
      <Title text="Printer Page " />

      <div className="flex  bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">
        <div className='w-full flex p-4 gap-4'>
          {/* LEFT SIDE */}
          <div className='max-w-1/2 flex bg-secondary-200 px-8  py-6 w-full rounded-xl border border-dark-350 shadow-lg'>
            <div className='flex flex-col w-full'>
                {
                    printer.printer.map(item=>{
                        return(
                            <div key={item._id as Key}>
                            <div>Printer S/N: {item.sn}</div>
                            <div>Printer Product Number: {item.pnum}</div>
                            <div>Printer Barcode: {item.barcode}</div>
                            </div>
                        )
                    })
                }

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className='flex flex-col w-1/2 '>


            
            
          </div>
          
        </div>
      </div>
    
    </>
  )
}

export default page