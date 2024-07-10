"use client";

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';

const GlobalSearch = () => {

  const router = useRouter(); // allows you to programmatically change routes inside Client Components.
  const pathname = usePathname(); // read the current URL's pathname.
  const searchParams = useSearchParams(); // read the current URL's query string

  const searchContainerRef = useRef(null)

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query || '');
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if(searchContainerRef.current && 
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    setIsOpen(false)

    document.addEventListener("click", handleOutsideClick)

    return () => {document.removeEventListener("click", handleOutsideClick)}
  }, [pathname])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search
        })

        // if (search === false){
        //   const newUrl = removeKeysFromQuery({
        //     params: searchParams.toString(),
        //     keysToRemove: ['global']
        //   })
        // }
        console.log("SEARCH LENGTH ==========>", search)

        router.push(newUrl, { scroll: false });
      } else {
        
        if(query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type']
          })

          console.log("QUERY newUrl==========>", newUrl)
          router.push(newUrl, { scroll: false });
        }

      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn)
  }, [search, pathname, router, searchParams, query])

  return (
    <div className="flex flex-row h-12 w-full max-w-[600px] max-lg:hidden relative" ref={searchContainerRef}>
      <div className="relative flex min-h-[56px] grow items-cetner gap-1 rounded-xl border-none">
        <Image className="absolute left-5 top-3.5 stroke-3" width={18} height={18} src="/assets/icons/search.svg" alt="search"/>
        <Input 
          className="px-4 pl-12 h-12 no-focus border-none text-base bg-dark-600 shadow-md rounded-3xl text-white" 
          placeholder="Search ..."
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value)

            if( !isOpen ) setIsOpen(true)
            if( e.target.value === '' && isOpen ) setIsOpen(false)
          
          }}
          />
      </div>
      {isOpen && <GlobalResult />}
  </div>
  )
}

export default GlobalSearch



