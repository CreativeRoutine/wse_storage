"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addAdditionalInfoSchema } from "@/lib/validations";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  onInput: (value: string) => void; // Callback для передачи данных в родительский компонент
  reset: boolean;
  label: string;
  onResetComplete?: () => void;
}

export default function InvoiceNumber({ label, reset, onInput, onResetComplete }: Props) {
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const form = useForm<z.infer<typeof addAdditionalInfoSchema>>({
    resolver: zodResolver(addAdditionalInfoSchema),
    defaultValues: {
      text: "",
    },
  });

  // Сбрасываем форму при изменении `reset`
  useEffect(() => {
    if (reset) {
      form.reset({ text: "" }); // Сброс значения
      setIsChanged(false); // Сбрасываем состояние изменения
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, form, onResetComplete]);

  return (
    <Form {...form}>
      <form className="space-y-4 w-full mx-auto mt-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <div className="w-full flex flex-row items-center ">
                <FormLabel
                  className={`w-2/3 text-md font-semibold ${
                    isChanged ? "text-green-500" : "text-slate-300"
                  }`}
                >
                  {label}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-3/4 outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                    placeholder="Your comment"
                    {...field} // Подключаем поле к react-hook-form
                    onChange={(e) => {
                      field.onChange(e); // Передаем событие в react-hook-form
                      const value = e.target.value;
                      setIsChanged(value.trim() !== ""); // Устанавливаем состояние изменения
                      onInput(value); // Передаем значение в родительский компонент
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}