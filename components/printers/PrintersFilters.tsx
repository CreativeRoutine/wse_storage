"use client"
import {Button} from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState } from "react";
import { PrintersPageFilters, PrintersCountPageFilters } from "@/constants/filters";
import { formUrlQuery, removeKeysFromQuery, formUrlQueryClean } from "@/lib/utils";

import { cn } from "@/lib/utils"

import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const PrintersFilters = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  })

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState('')

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
  
    if (date?.from && date?.to) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set('from', date.from.toISOString());
      searchParams.set('to', date.to.toISOString());
  
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      router.push(newUrl, { scroll: false });
    }
  };
    
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
      {/* OLD / NEW FILTER */}
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

      {/* CALENDAR FILTER */}
      <div className={cn("grid gap-2", className)}>
        <Popover  >
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL d, yyyy")} -{" "}
                    {format(date.to, "LLL d, yyyy")}
                  </>
                ) : (
                  format(date.from, "LLL d, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-dark-400 text-white" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              // onSelect={setDate}
              onSelect={handleDateChange}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* QTTY FILTER */}
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