// AddPartFromPrinter.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast";
import { addPartToLocation } from "@/lib/actions/parts.action"; // Экшн для добавления детали
import { fetchPartsList } from "@/lib/actions/partsList.action"; // Экшн для получения списка запчастей
import { addPartFromPrinterSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  printerId: string;
  printerProductNumber: string;
}

export default function AddPartFromPrinter({ printerId, printerProductNumber }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partsList, setPartsList] = useState<string[]>([]); // Список доступных частей

  // Форма и схема валидации
  const form = useForm<z.infer<typeof addPartFromPrinterSchema>>({
    resolver: zodResolver(addPartFromPrinterSchema),
    defaultValues: {
      printerId: printerId,
      printerProductNumber: printerProductNumber,
      partName: "",
      barcode: "",
      location: "",
    },
  });

  // Загрузка списка доступных частей при изменении printerProductNumber
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPartsList(printerProductNumber);

      if (response.success && response.parts) {
        setPartsList(response.parts as string[]); // Приводим parts к типу string[]
      } else {
        console.error(response.message);
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [printerProductNumber, toast]);

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof addPartFromPrinterSchema>) {
    setIsSubmitting(true);
    const createdOn = moment().tz("America/Chicago").toDate();
  
    const partData = {
      printerId,
      printerProductNumber,
      partName: values.partName,
      barcode: values.barcode,
      location: values.location,
      createdOn: createdOn,
    };
  
    console.log("Submitting part data:", partData); // Лог данных для отладки
  
    try {
      const response = await addPartToLocation(partData);
  
      setIsSubmitting(false);
      form.reset();
      router.refresh();
  
      toast({
        title: response.success ? "Part added successfully" : "Error adding part",
        description: response.message,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("An error occurred while adding the part:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the part",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-transparent px-0 mb-2 py-2 w-full rounded-xl border-0 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
          <FormField
            control={form.control}
            name="partName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Part Name</FormLabel>
                <FormControl>
                <div className="flex">
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full focus:outline-none bg-dark-600 border-0">
                      <SelectValue placeholder="Select Part Name" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 p-0 text-white border-0">
                      <SelectGroup className="py-4">
                        {partsList.map((part) => (
                          <SelectItem key={part} value={part} className='py-2 text-white hover:bg-dark-200'>{part}</SelectItem>
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

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Barcode (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Barcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Storage Location (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Storage Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Part"}
          </Button>
        </form>
      </Form>
    </div>
  );
}