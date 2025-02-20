"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  setTempBarcodes: any;
}

export default function CreateStorageBarcodes({ setTempBarcodes }: Props) {
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState("WSE-W1");

  const formSchema = z.object({
    start: z
      .string()
      .regex(/^[A-Z][0-9]+$/, "Start value must be in format 'A1', 'B2', etc."),
    finish: z
      .string()
      .regex(/^[0-9]+$/, "Finish value must be a number."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: "A1",
      finish: "10",
    },
  });

  async function onSubmit(values: { start: string; finish: string }) {
    console.log("VALUES", values);
  
    try {
      const { start, finish } = values;
  
      // Проверяем формат начального значения
      if (!/^[A-Z][0-9]+$/.test(start)) {
        toast({
          title: "Invalid input",
          description: "Start must be in format 'A1', 'B2', etc.",
          variant: "destructive",
        });
        return;
      }
  
      // Проверяем формат конечного значения
      if (!/^[0-9]+$/.test(finish)) {
        toast({
          title: "Invalid input",
          description: "Finish must be a number.",
          variant: "destructive",
        });
        return;
      }
  
      const startRow = start[0]; // Первая буква (ряд)
      const startShelf = parseInt(start.slice(1), 10); // Число из стартового значения
      const finishShelf = parseInt(finish, 10); // Конечное значение (полка)
  
      // Проверяем корректность диапазона
      if (isNaN(startShelf) || isNaN(finishShelf) || finishShelf < startShelf) {
        toast({
          title: "Invalid range",
          description: "Finish shelf must be greater than or equal to start shelf.",
          variant: "destructive",
        });
        return;
      }
  
      // Обновляем состояние
      setTempBarcodes({
        type: warehouse,
        start: start,
        finish: finish, // Оставляем значение числом
      });
  
      toast({
        title: "Barcodes generated",
        description: `Generated barcodes for ${warehouse} from ${start} to ${startRow}${finish}`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-secondary-200 w-full mt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="warehouse"
            render={() => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <Select 
                    onValueChange={setWarehouse} 
                    defaultValue="WSE-W1"
                    >
                  <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>

                  <SelectContent className="bg-dark-400 p-0 text-white border-0">
                    <SelectItem value="WSE-W1" className="py-2 text-white hover:bg-dark-200">WSE-W1</SelectItem>
                    <SelectItem value="WSE-W2" className="py-2 text-white hover:bg-dark-200">WSE-W2</SelectItem>
                  </SelectContent>

                </Select>
              </FormItem>
            )}
          />

          <FormField
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Start (e.g., A1)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter start row and shelf (e.g., A1)" className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="finish"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Finish (e.g., 10)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter finish shelf (e.g., 10)" className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6">
            Generate Barcodes
          </Button>
        </form>
      </Form>
    </div>
  );
}