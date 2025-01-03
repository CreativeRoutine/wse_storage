"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addOptionSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
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

interface Props {
  label: string; // Метка (название поля)
  options: string[]; // Список опций
  onSelect: (value: string) => void; // Колбэк для выбора
  reset: boolean; // Указывает, нужно ли сбросить поле
  onResetComplete?: () => void; // Колбэк после сброса
}

export default function OptionSelect({ label, options, onSelect, reset, onResetComplete }: Props) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // Выбранное значение
  const form = useForm<z.infer<typeof addOptionSchema>>({
    resolver: zodResolver(addOptionSchema),
    defaultValues: {
      option: "",
    },
  });

  // Обработчик выбора опции
  const handleChange = (value: string) => {
    setSelectedValue(value); // Устанавливаем выбранное значение
    onSelect(value); // Передаём наверх
    form.setValue("option", value); // Устанавливаем значение в форму
  };

  // Сбрасываем форму при изменении `reset`
  useEffect(() => {
    if (reset) {
      setSelectedValue(null); // Сбрасываем выбранное значение
      form.reset({ option: "" }); // Сбрасываем поле в форме
      if (onResetComplete) {
        onResetComplete(); // Вызываем колбэк после сброса
      }
    }
  }, [reset, form, onResetComplete]);

  return (
    <Form {...form}>
      <form className="space-y-4 w-full mx-auto">
        <div className="flex gap-6">
          <div className="w-full">
            <FormField
              control={form.control}
              name="option"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <div className="flex items-center">
                    <FormLabel
                      className={`block font-semibold w-2/3 ${
                        selectedValue ? "text-green-500" : "text-slate-300"
                      }`}
                    >
                      {label}
                    </FormLabel>
                    <Select
                      onValueChange={handleChange}
                      value={selectedValue || ""}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-400 p-0 text-white border-0">
                        <SelectGroup className="py-4">
                          {options.map((option) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}