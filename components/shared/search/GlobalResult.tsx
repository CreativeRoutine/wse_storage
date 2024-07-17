"use client"

import React, { useEffect, useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import GlobalFilters from './GlobalFilters'
import { globalSearch } from '@/lib/actions/general.action'

const GlobalResult = () => {
  const searchParams = useSearchParams(); // read the current URL's query string
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState([
    {type: 'printer',barcode:"12121212", id: '1'}, 
    {type: 'pallet',barcode:"21212121", id: '2'}, 
    {type: 'user',username:"vitaliy", id: '3'},
    {type: 'supplier',ponumber:"01010101", id: '4'}
  ])

  const global = searchParams.get('global')
  const type = searchParams.get('type')

  useEffect(() => {
    const fetchResult = async () => {
      setResult([])
      setIsLoading(true)

      try{
        // Fetch ALL data from API
        const res = await globalSearch({query: global, type})
        // console.log(res);

        setResult(JSON.parse(res));

      } catch (error) {
        console.error(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }

    if(global) {fetchResult()}
  }, [global, type])

  const renderLink = (type: string, id: string) => {
    switch (type){
      case 'printer':
        return `/printers/${id}`

      case 'supplier':
        return `/supplier/${id}`

      case 'pallet':
        return `/storage/${id}`

      case 'user':
        return `/user/${id}`

        default:
          return '/'
    }
  }

  return (
    <div className="absolute px-4 top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <div className='font-semibold'>
        <GlobalFilters />
      </div>
      <div className='my-5 h-[1px] bg-dark-500 ' />

      <div className='space-y-5'>
        <p className='font-semibold'>
          Top Match
        </p>
        {
          isLoading ? (
          <div className='flex-center flex-col px-5'>
              <ReloadIcon className='my-2 h-10 w-10 text-primary-500 animate-spin'/>
              <p className='text-sm text-slate-600'>Searching in database</p>
            </div>  
          ) : ( 
            <div className='flex flex-col gap-2'>
              {
                result.length > 0 ? (
                  console.log(result),
                  result.map((item: any, index: number) => (
                    <Link 
                    // @ts-ignore
                    href={renderLink(item.type, item.id)}
                    key={item.type + item.id + index}
                    className='group flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-primary-500 hover:text-white rounded-xl dark:hover:bg-dark-500 transition-colors duration-200 ease-in-out'
                    >
                      <Image 
                        className='invert-colors mt-1 object-contain group-hover:invert-0'
                        src={"/assets/icons/tag.svg"} 
                        width={18} 
                        height={18} 
                        alt="tags"/>
                      <div className="flex flex-col">
                        <p className='text-medium line-clamp-1'>{item.title}</p>
                        <p className='group-hover:text-white text-slate-500 text-sm font-bold capitalize'>{item.type}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex-center flex-col px-5">
                    <p className='text-sm text-slate-600'>
                      Oops, no result found!
                    </p>
                    </div>
                )
              }
            </div>
          )
        }
      </div>  
    </div>
  )
}

export default GlobalResult