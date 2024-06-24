"use client"
import {Button} from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { PrintersPageFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";

export const PrintersFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [active, setActive] = useState('')
    
      const handleClickType = (item: string) => {

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
      

    return(
        <div className="mt-2 hidden flex-row justify-start flex-wrap gap-3 md:flex">
            
            {
                PrintersPageFilters.map(item => (
                    <Button 
                        key={item.value}
                        onClickCapture={() => handleClickType(item.value)}
                        className={`text-white ${active === item.value ? 'bg-dark-500' : 'bg-dark-400'}`}
                    >
                        {item.name}
                    </Button>
                ))
            }
        </div>
    )
}