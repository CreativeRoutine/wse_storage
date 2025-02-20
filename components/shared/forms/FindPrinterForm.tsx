"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { findPrinterSchema } from "@/lib/validations";

interface Props {
  onSubmit: (values: { barcode: string }) => void;
  isSubmitting: boolean;
  label: string;
  reset: boolean; // Новый проп для сброса
}

const FindPrinterForm: React.FC<Props> = ({ onSubmit, isSubmitting, label, reset }) => {
  const [isValidInput, setIsValidInput] = useState(false);
  const form = useForm<z.infer<typeof findPrinterSchema>>({
    resolver: zodResolver(findPrinterSchema),
    defaultValues: {
      barcode: "",
    },
  });

  // Сбрасываем значение поля ввода при reset
  useEffect(() => {
    if (reset) {
      form.reset({ barcode: "" });
      setIsValidInput(false);
    }
  }, [reset, form]);

  const handleInputChange = (value: string) => {
    setIsValidInput(value.trim().length > 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={`text-slate-300 text-md font-semibold transition-all ${
                  isValidInput ? "text-green-500" : "text-slate-300"
                }`}
              >
                {label}
              </FormLabel>
              <FormControl>
                <div className="w-full flex flex-row gap-2">
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e); // Обновляем значение в форме
                      handleInputChange(e.target.value); // Проверяем валидность ввода
                    }}
                    placeholder="Enter barcode or serial number"
                    className="w-3/4 outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    className="bg-primary-500 text-white text-md w-1/4 p-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Searching..." : "Find Printer"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default FindPrinterForm;