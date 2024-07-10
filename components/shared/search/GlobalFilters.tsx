"use client";

import { GlobalSearchFilters } from '@/constants/filters'
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const GlobalFilters = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get('type');

  const [active, setActive] = useState(typeParams || '');

  console.log("typeParams => ",typeParams)

  // console.log("ROUTER",router)
  // console.log("Search params",searchParams)

  const handleTypeClick = (item: string) => {
    if(active === item) {
      setActive("");

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null
      })

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: item.toLowerCase()
      })

        router.push(newUrl, { scroll: false });
      }
  }

  return (
    <div className='flex items-center gap-5 px-5'>
      
      <div className='text-dark500 text-sm'>Type:</div>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button 
            type="button" 
            key={item.value}
            className={`border border-primary-100 rounded-2xl px-5 py-2 capitalize text-sm font-semibold dark:bg-dark-400 ${active === item.value ? 'bg-primary-500 text-white' : 'text-dark-500 bg-light-800'} hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-colors duration-200 ease-in-out`}
            onClick={()=> handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters