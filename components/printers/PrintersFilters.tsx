"use client"
import {Button} from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PrintersPageFilters, PrintersCountPageFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";

export const PrintersFilters = () => {
    
    const searchParams = useSearchParams();
    const router = useRouter();

    const [active, setActive] = useState('')
    
  const handleClickTypeDate = (item: string) => {

    if(active === item) {
      setActive("")
      const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: null
      })

      router.push(newUrl, { scroll: false });

    } else {
      setActive(item)

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase()
      })

      router.push(newUrl, { scroll: false });

    }
  }

  const handleClickTypeQtty = (item: string) => {

    if(active === item) {
      setActive("")
      const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: null
      })

      router.push(newUrl, { scroll: false });

    } else {
      setActive(item)

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'qtty',
        value: item.toLowerCase()
      })

      router.push(newUrl, { scroll: false });

    }
  }
      

  return(
    <div className="mt-2 hidden flex-row justify-start md:flex md:justify-between">
      <div className="flex gap-3">
      {
          PrintersPageFilters.map(item => (
              <Button 
                  key={item.value}
                  onClickCapture={() => handleClickTypeDate(item.value)}
                  className={`text-white ${active === item.value ? 'bg-dark-500' : 'bg-dark-400'}`}
              >
                  {item.name}
              </Button>
          ))
      }
      </div>
      <div className="flex gap-3">
      {
          PrintersCountPageFilters.map(item => (
              <Button 
                  key={item.value}
                  onClickCapture={() => handleClickTypeQtty(item.value)}
                  className={`text-white ${active === item.value ? 'bg-dark-500' : 'bg-dark-400'}`}
              >
                  {item.name}
              </Button>
          ))
      }
      </div>

    </div>
  )
}