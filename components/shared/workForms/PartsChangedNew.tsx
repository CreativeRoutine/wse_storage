"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { partsChangedSchemaNew } from "@/lib/validations";

interface Props {
  label: string;
  onSelect: (selectedParts: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void;
}

export default function PartsChanged({
  label,
  onSelect,
  reset,
  onResetComplete,
}: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedValue, setSelectedValue] = useState(false); // Выбранное значение
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  

  // NEW LOGIC
  // =================
  // =================
  
  const [displayPartForm, setdisplayPartForm] = useState(false); // Display  change part form
  const [partsData, setPartsData] = useState<any[]>([]); // Список деталей
  const [currentPartName, setCurrentPartName] = useState<string>("");
  const [allData, setAllData] = useState<any>([]);

  // console.log("partsData===>",partsData)

  useEffect(() => {
      // if (printerProductNumber) {
        if (true) {
        getPrinterData(); // This function receive all parts names to display them and to choose from
      }
    // }, [printerProductNumber]);
  }, [label]);

  async function getPrinterData() {
    try {

      
      // const partsResult = await getPartsData(getRandomValues.name);


      // const response: any = await getPartsByProductNumberPlain({
      //   printerName: printerProductNumber,
      // });

      // console.log("THIS IS RESPONSE FROM PARTS CHANGED ====>",response)

      // const parts = JSON.parse(JSON.stringify(response));
      // setPartsData(parts.parts || []); // Сохраняем детали

      const parts1 = ["front", "back", "left", "right", "top", "bottom", "other"];
      setPartsData(parts1); // Сохраняем детали


    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }
  
  


  // =================
  // =================
  // END OF NEW LOGIC

  const form = useForm<z.infer<typeof partsChangedSchemaNew>>({
    resolver: zodResolver(partsChangedSchemaNew),
    defaultValues: {
      name: "",
    },
  });

  const handlePartSelect = (part: string, all:any) => {

    // NEW CODE 
    // 
    setdisplayPartForm(true);
    setCurrentPartName(part);
    setAllData(all);
  
    // 
    // END OF NEW CODE
    // 


    // if(selectedParts.length > 0){
    //   setSelectedValue(false);
    // }
    setSelectedValue(true)
    const updatedParts = selectedParts.includes(part)
      ? selectedParts.filter((p) => p !== part) // Убираем, если уже есть
      : [...selectedParts, part]; // Добавляем новую часть

    setSelectedParts(updatedParts);
    onSelect(updatedParts); // Передаем наверх
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4 w-full mx-auto">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              // First Input
              <FormItem>
                <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Name:</FormLabel>
                <FormControl>
                  <div className="flex justify-between gap-2 items-center ">
                    <Input
                      className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                      placeholder="Printer name"
                      {...field}
                    />
                    <Button type="submit" className="bg-primary-500 text-white text-lg w-1/3 p-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Searching ...'}
                        </>
                      ) : (
                        <>
                        {'Search'}
                        </>
                      )}
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>

      {
        // displayPartForm && (
          // <AddPartToPrinter printer={printerProductNumber} partName={currentPartName} allData={allData} reset={reset} />
        // )
      }
    </>
  );
}