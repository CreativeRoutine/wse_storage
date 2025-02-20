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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { partsChangedSchema } from "@/lib/validations";
import { getPartsByProductNumberPlain } from "@/lib/actions/parts.action";
import AddPart from "../parts/AddGenericPart";
import AddPartToPrinter from "./AddPartToPrinter";

interface Props {
  printerId: string;
  printerProductNumber: string;
  label: string;
  availableParts?: string[];
  onSelect: (selectedParts: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void;
}

export default function PartsChanged({
  printerId,
  printerProductNumber,
  label,
  availableParts = [
    "Laser guard",
    "Front",
    "Fan",
    "Fuser",
    "Fuser sleeve",
    "Scanner",
    "Screen",
    "Rolls",
    "Tray rolls",
    "Tray's front",
    "Top",
    "Left side",
    "Right side",
    "Tray",
    "Rear Doors",
    "Formator's door",
    "Formator",
    "Pressure roll",
    "Solenoid #1",
    "Solenoid #2",
  ],
  onSelect,
  reset,
  onResetComplete,
}: Props) {

  const [selectedValue, setSelectedValue] = useState(false); // Выбранное значение
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  

  // console.log("printerId =>", printerId, "printerProductNumber =>", printerProductNumber, "label =>", label, "availableParts =>", availableParts, "onSelect =>", onSelect, "reset =>", reset, "onResetComplete =>", onResetComplete);

  
  // NEW LOGIC
  // =================
  // =================
  
  const [displayPartForm, setdisplayPartForm] = useState(false); // Display  change part form
  const [partsData, setPartsData] = useState<any[]>([]); // Список деталей
  const [currentPartName, setCurrentPartName] = useState<string>("");
  const [allData, setAllData] = useState<any>([]);

  // console.log("partsData===>",partsData)

  useEffect(() => {
      if (printerProductNumber) {
        getPrinterData(); // This function receive all parts names to display them and to choose from
      }
    }, [printerProductNumber]);

  async function getPrinterData() {
    try {

      const response: any = await getPartsByProductNumberPlain({
        productNumber: printerProductNumber,
      });

      const parts = JSON.parse(JSON.stringify(response));
      setPartsData(parts.parts || []); // Сохраняем детали


    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }
  
  


  // =================
  // =================
  // END OF NEW LOGIC

  const form = useForm<z.infer<typeof partsChangedSchema>>({
    resolver: zodResolver(partsChangedSchema),
    defaultValues: {
      button: [],
    },
  });

  const handlePartSelect = (part: string, all:any) => {

    console.log("ON CLIC", all)

    // NEW CODE 
    // 
    setdisplayPartForm(true);
    setCurrentPartName(part);
    setAllData(all);
  
    // 
    // END OF NEW CODE
    
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

  useEffect(() => {
    if (selectedParts.length > 0){
      setSelectedValue(true)
    } else {
      setSelectedValue(false)
    }
  }, [selectedParts]);

  useEffect(() => {
    if (reset) {
      setSelectedValue(false)
      setSelectedParts([]); // Сбрасываем выбранные части
      form.reset({ button: [] }); // Сбрасываем форму
      if (onResetComplete) {
        onResetComplete(); // Вызываем колбэк после сброса
      }
    }
  }, [reset, form, onResetComplete]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-4 w-full mx-auto">
          <FormField
            control={form.control}
            name="button"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`block font-semibold w-2/3 mb-4 ${
                      selectedValue ? "text-green-500" : "text-slate-300"
                    }`}
                  >
                    {label}
                </FormLabel>

                <FormControl>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {/* {availableParts.map((part) => ( */}
                      {partsData.map((part, i) => (
                      <button
                        key={i}
                        type="button" // Указываем явный тип кнопки
                        {...field}
                        onClick={() => handlePartSelect(part.partsName, part)}
                        className={`py-2 px-4 rounded-lg ${
                          selectedParts.includes(part.partsName)
                            ? "bg-primary-500 text-white"
                            : "bg-dark-600 text-white hover:bg-dark-400"
                        }`}
                      >
                        {part.partsName} / {part.part.length}
                      </button>
                    ))}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {
        displayPartForm && (
          <AddPartToPrinter printer={printerProductNumber} partName={currentPartName} allData={allData} reset={reset} />
        )
      }
    </>
  );
}