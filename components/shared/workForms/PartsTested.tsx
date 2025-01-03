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

interface Props {
  label: string;
  availableParts?: string[];
  onSelect: (selectedParts: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void;
}

export default function ChangedPartsComponent({
  label,
  availableParts = [
    "USB",
    "Scanner",
    "Network",
    "Cold Reset",
    "Cleaning page",
    "NVRam reset",
    "Maintenance Kit",
    "Laser guard",
    "Rolls",
    "Tray rolls",
    "Pressure roll",
    "Solenoid #1",
    "Solenoid #2",
    "Top Smth",
  ],
  onSelect,
  reset,
  onResetComplete,
}: Props) {

  const [selectedValue, setSelectedValue] = useState(false); // Выбранное значение
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const form = useForm<z.infer<typeof partsChangedSchema>>({
    resolver: zodResolver(partsChangedSchema),
    defaultValues: {
      button: [],
    },
  });

  const handlePartSelect = (part: string) => {
    
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
                  {availableParts.map((part) => (
                    <button
                      key={part}
                      type="button" // Указываем явный тип кнопки
                      {...field}
                      onClick={() => handlePartSelect(part)}
                      className={`py-2 px-4 rounded-lg ${
                        selectedParts.includes(part)
                          ? "bg-primary-500 text-white"
                          : "bg-dark-600 text-white hover:bg-dark-400"
                      }`}
                    >
                      {part}
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
  );
}