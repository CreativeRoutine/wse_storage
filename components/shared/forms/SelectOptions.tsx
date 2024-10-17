"use client";
import React, {useEffect} from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SelectOptionProps {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
  reset: boolean;
  onResetComplete: any;
}

const SelectOption: React.FC<SelectOptionProps> = ({ label, options, onSelect, reset, onResetComplete }) => {
  const schema = z.object({ option: z.string().nonempty() });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      option: "",
    },
  });

  const [selectedOption, setSelectedOption] = React.useState(""); // Локальное состояние для выбора

  useEffect(() => {
    if (reset) {
      form.reset();
      setSelectedOption(""); // Сбрасываем значение выбора
      onResetComplete(); // Сбрасываем formReset обратно в false в родительском компоненте
    }
  }, [reset, onResetComplete]);
  
  return (
    <div className="my-2">
      <Form {...form}>
        <form className="space-y-4 w-full mx-auto">
          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-y-0'>
                <FormLabel className="w-2/3  text-sm text-slate-300 font-semibold">{label}</FormLabel>
                <FormControl className="mt-0">
                  <Select
                    value={selectedOption} // Устанавливаем значение из состояния
                    onValueChange={(value) => {
                      setSelectedOption(value); // Обновляем состояние
                      field.onChange(value); // Обновляем поле в форме
                      onSelect(value); // Передача выбранного значения в родительский компонент
                    }}
                  >
                    <SelectTrigger className="w-full text-slate-400 focus:text-green-500 mt-0 focus:outline-none bg-dark-600 border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0 border-slate-300">
                      <SelectValue placeholder={`Select ${label}`}  />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 text-white border-0">
                      <SelectGroup>
                        {options.map((option) => (
                          <SelectItem key={option} value={option} className='py-2 text-white hover:bg-dark-200'>{option}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};


export default SelectOption;
