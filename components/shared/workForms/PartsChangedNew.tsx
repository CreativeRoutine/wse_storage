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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchForPartSchema, partsChangedSchemaNew } from "@/lib/validations";
import { getListOfAllPrinters, getPartsByName } from "@/lib/actions/parts.action";
import { useToast } from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation';

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

  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialPrintersList, setInitialPrintersList] = useState<string[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<string>("Not set");
  const [listOfParts, setListOfParts] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState(false); // Выбранное значение

  
  // 1. Define your form.
  // searchForPartSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof searchForPartSchema>>({
    resolver: zodResolver(searchForPartSchema),
    defaultValues: {
      name: "",
      parts: "",
    },
  });
  
  // 2. Define a submit handler.
  // searchForPartSchema took from lib/validations.ts to validate the form
  // async function onSubmit(values: z.infer<typeof searchForPartSchema>) {
  //   setIsSubmitting(true);
  
  //   try {
  //     const response = await getPartsByName({
  //       name: values.name
  //     });
  
  //     setIsSubmitting(false); // Reset isSubmitting state
  
  //     // if (response.success) {
  //     //   // Если принтер успешно создан, показываем успешное уведомление
  //     //   toast({
  //     //     title: "Printer created successfully!",
  //     //     variant: "default",
  //     //   });
  //     //   form.reset({}); // Reset form fields
  //     //   router.refresh();
  //     // } else {
  //     //   // Если ошибка, показываем сообщение об ошибке
  //     //   toast({
  //     //     title: "Error creating printer!",
  //     //     description: response.message,
  //     //     variant: "destructive",
  //     //   });
  //     // }
  //   } catch (error) {
  //     console.error("THIS IS AN ERROR", error);
  //     setIsSubmitting(false); // Сбрасываем состояние при ошибке
  //     toast({
  //       title: "Unexpected Error",
  //       description: "An error occurred while creating the printer. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // }

  // MY NEW LOGIC
  // =================

  // 1. Get all printers names on load
  // 1.1 Get all printers names and save them to state initialPartsList
  useEffect(() => {
      getPrinterData(); // This function receive all parts names to display them and to choose from
  }, []);
  
  async function getPrinterData() {
    try {

      const response: any = await getListOfAllPrinters();

      const printers = JSON.parse(JSON.stringify(response));
      // console.log("RESPONSE===>", printers)
      setInitialPrintersList(printers)
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  // 2. On change field #1 we change state "currentPrinter"
  const handlePrinterChange = (value: string) => {
    setCurrentPrinter(value)
  };

  // 3. Check if current printer (sate "currentPrinter") changed run find parts function
  // 3.1 Find current Printer's list of parts
  useEffect(() => {
      findParts() // This function receive all parts names to display them and to choose from
  }, [currentPrinter]);

  async function findParts() {
    try {

      console.log("THIS IS CURRENT PRINTER",currentPrinter)
  
      const response: any = await getPartsByName({currentPrinter });

      const parts = JSON.parse(JSON.stringify(response));
      setListOfParts(parts)
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }



  // __. Handle Parts change in form - 2nd field
  // const handlePartChange = (value: string) => {
  //   onSelect(value)
  // };


  // =================
  // END OF MY NEW LOGIC
  

  return (
    <>
      <div className="w-full mb-2">
        <Form {...form}>
          <form className="space-y-4 w-full mx-auto" >
          
          {/* FIELD #1 */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              // First Input
              <FormItem>
                <FormLabel className={`block font-semibold w-2/3 mb-4 ${
                      selectedValue ? "text-green-500" : "text-slate-300"
                    }`}
                  >
                    {label}
                </FormLabel>
                <FormControl>
                  <div className="flex justify-between gap-2 items-center ">
                  <Select
                      onValueChange={handlePrinterChange}
                      // value={false || ""}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                        <SelectValue placeholder="Printer" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-400 p-0 text-white border-0">
                        <SelectGroup className="py-4">
                          {initialPrintersList.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="py-2 text-white hover:bg-dark-200"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

          {/* FIELD #2 */}
          <FormField
            control={form.control}
            name="parts"
            render={({ field }) => (
              // First Input
              <FormItem>
                <FormLabel className="block font-semibold w-2/3 mb-4text-slate-300">Parts</FormLabel>
                <FormControl>
                  <div className="flex justify-between gap-2 items-center ">
                  <Select
                      onValueChange={handlePrinterChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                        <SelectValue placeholder="Printer" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-400 p-0 text-white border-0">
                        <SelectGroup className="py-4">
                          {listOfParts.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="py-2 text-white hover:bg-dark-200"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            />
          </form>
        </Form>
      </div>
      <div className="mb-2">
        {
          currentPrinter === "Not set" ?
          <div className="text-red-500 text-sm font-normal">
            {currentPrinter}
          </div> :
           <div className="text-white text-sm font-normal">{currentPrinter}</div>
        }
      </div>

      {
        // displayPartForm && (
          // <AddPartToPrinter printer={printerProductNumber} partName={currentPartName} allData={allData} reset={reset} />
        // )
      }
    </>
  );
}