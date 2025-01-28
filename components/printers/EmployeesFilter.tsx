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


export const EmployeesFilters = ({
    className,
  }: React.HTMLAttributes<HTMLDivElement>) => {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
      new Date()
    );
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
  
    const handleDateChange = (date: Date | undefined) => {
      setSelectedDate(date);

      console.log("date from filter ==>", date); 
  
      if (date) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("date", date.toISOString());
  
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        router.push(newUrl, { scroll: false });
      }
    };
  
    const handleResetFilters = () => {
      // Убираем дату из URL
      const baseUrl = pathname;
      router.push(baseUrl, { scroll: false });
  
      // Сбрасываем выбранную дату
      setSelectedDate(undefined);
    };

  return (
    <div className="mt-2 flex flex-row justify-between">
      {/* Кнопка для выбора даты */}
      <div className={cn("grid gap-2 mb-4", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal bg-dark-300 text-white border-0",
                !selectedDate && "text-muted-foreground text-white"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "LLL d, yyyy")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-dark-400 text-white" align="start">
            <Calendar
              initialFocus
              mode="single"
              defaultMonth={selectedDate}
              selected={selectedDate}
              onSelect={handleDateChange}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Кнопка для сброса фильтров */}
      <div className="flex gap-3">
        <Button
          className="text-white bg-red-500 hover:bg-red-600"
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};