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
import { deletePrinterPartFromStorage, getListOfAllPrinters, getPartsByName } from "@/lib/actions/parts.action";
import { useToast } from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation';

interface Props {
  label: string;
  onSelect: (selectedParts: string[]) => void;
  selected: string[];
  reset: boolean;
  onResetComplete?: () => void;
}

export default function PartsChanged({
  label,
  onSelect,
  selected,
  reset,
  onResetComplete,
}: Props) {

  

  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialPrintersList, setInitialPrintersList] = useState<string[]>([]);
  const [listOfParts, setListOfParts] = useState<string[]>([]); // Список всех деталей
  const [selectedValue, setSelectedValue] = useState(false); // Выбранное значение

  
  // NEW LOGIC OF STATES
  const [printerName, setPrinterName] = useState<string | null>(null);
  const [partName, setPartName] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);


  // =================
  
  // 1. Define your form.
  // searchForPartSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof searchForPartSchema>>({
    resolver: zodResolver(searchForPartSchema),
    defaultValues: {
      name: "",
      parts: "",
      barcode: "",
    },
  });


  
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
      setInitialPrintersList(printers)
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }


  // 2. On change field #1 we change state "currentPrinter"
  const handlePrinterChange = (value: string) => {
    setPrinterName(value)
  };

  // Обработчик выбора опции
  const handleChange = (value: string) => {
    setPrinterName(value); // Устанавливаем выбранное значение
    form.setValue("name", value); // Устанавливаем значение в форму
  };

  // 3. Check if current printer (sate "currentPrinter") changed run find parts function
  // 3.1 Find current Printer's list of parts
  useEffect(() => {
      findParts() // This function receive all parts names to display them and to choose from
  }, [printerName]);

  async function findParts() {
    try {

      const response: any = await getPartsByName({currentPrinter: printerName });

      const parts = JSON.parse(JSON.stringify(response));
      setListOfParts(parts)
      
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  const handlePartChange = (value: any) => {
    setPartName(value);
    form.setValue("parts", value, { shouldValidate: true }); // Обновляем поле формы и запускаем валидацию
  };

  
  async function onSubmit(values: z.infer<typeof searchForPartSchema>) {
    setIsSubmitting(true);
  
    try {
      const response = await deletePrinterPartFromStorage({
        name: values.name,
        parts: values.parts,
        barcode: values.barcode,
      });
  
      if (response.success) {
        toast({
          title: "Part replaced successfully!",
          variant: "default",
        });
        const part = values.parts
        onSelect([...selected, part]); // Добавляем, не перезаписываем
        form.reset({}); // Сбрасываем все поля формы
        setPrinterName(null); // Сбрасываем состояние принтера
        setPartName(null); // Сбрасываем состояние детали
        setBarcode(null); // Сбрасываем состояние barcode
        setListOfParts([]); // Очищаем список деталей
  
        setIsSubmitting(false); // Сбрасываем состояние загрузки
      } else {
        setIsSubmitting(false);
        setPrinterName(null); // Сбрасываем состояние принтера
        setPartName(null); // Сбрасываем состояние детали
        setBarcode(null); // Сбрасываем состояние barcode
        setListOfParts([]);
        toast({
          title: "Error replacing part!",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
      setIsSubmitting(false);
      toast({
        title: "Unexpected Error",
        description: "An error occurred while replacing the part. Please try again.",
        variant: "destructive",
      });
    }
  }

  // =================
  // END OF MY NEW LOGIC
  

  return (
    <>
      <div className="w-full mb-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto" >
          
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
                      // onValueChange={handlePrinterChange}
                      onValueChange={handleChange}
                      value={printerName || ""}
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
          {
            listOfParts.length > 0 && (

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
                          onValueChange={handlePartChange}
                          value={partName || ""}
                          defaultValue={field.value}

                        >
                          <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                            <SelectValue  placeholder="Parts" className="hello w-ful"/>
                          </SelectTrigger>
                          <SelectContent className="bg-dark-400 p-0 text-white border-0 w-full">
                            <SelectGroup className="py-4 w-full">
                              {
                              //  listOfParts ? "Loading..." : "Select printer first"
                              listOfParts.map((option:any) => (
                                <SelectItem
                                  key={option.partsName}
                                  value={option.partsName}
                                  className="py-2 text-white hover:bg-dark-200"
                                >
                                  <div className="flex flex-row justify-around gap-4">
                                  <div>{option.partsName}</div> / <div>{option.part.length} / {option.maxParts}</div> / <div>{option.part[0]?.location || "No location"}</div>

                                  </div>
                                </SelectItem>
                              ))
                              }
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
    
                    <FormMessage />
                  </FormItem>
                )}
                />
            )
          }

          {/* FILED #3 */}

          {
            partName ? (
              <>
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Barcode"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                        'Replacing ...'
                    ) : (
                    'Replace part'
                    )}
                  </Button>
              </>
            ) : null
          }

          </form>
        </Form>
      </div>
    </>
  );
}

