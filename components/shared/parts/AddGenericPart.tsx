"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addGenericPartSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";

import { addGenericPart, getAllPartsModels } from "@/lib/actions/parts.action";

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
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";






export default function AddPart({ parts }: any) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [selectedProductNumber, setSelectedProductNumber] = useState(""); // Выбранный productNumber
  const [partsNames, setPartsNames] = useState([]); // Список partsName для выбранного productNumber

  const form = useForm<z.infer<typeof addGenericPartSchema>>({
    resolver: zodResolver(addGenericPartSchema),
    defaultValues: {
      partName: "",
      productNumber: "",
      barcode: "",
      location: "",
    },
  });

  // Обработчик выбора productNumber
  const handleProductNumberChange = (value: string) => {
    setSelectedProductNumber(value);

    // Получаем список partsName для выбранного productNumber
    const selectedPart = parts.find((part: any) => part.productNumber === value);
    if (selectedPart) {
      setPartsNames(selectedPart.parts.map((p: any) => p.partsName)); // Извлекаем partsName
    } else {

      setPartsNames([]);
      setSelectedProductNumber("");
    }
  };

  async function onSubmit(values: z.infer<typeof addGenericPartSchema>) {
    setIsSubmitting(true);

    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);

    try {
      const response: any = await addGenericPart({
        barcode: values.barcode,
        location: values.location,
        createdOn: createdOn,
        partName: values.partName,
        productNumber: values.productNumber,
      });

      setIsSubmitting(false);

      // router.push(`/addpart`)
      router.push(`/parts`)
      form.reset();
      router.refresh();
      
      // setSelectedProductNumber(""); // Сбрасываем выбор принтера
      // setPartsNames([]); // Сбрасываем список частей

      
      
      toast({
        title: response.message,
        variant: response.success ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
    }
  }

  return (
    <div className="bg-secondary-200 px-6 mb-1 py-6 w-full lg:w-1/2 rounded-xl border border-dark-350 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
          
          
          {/* Select Product Number */}
          <FormField
            control={form.control}
            name="productNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Select Printer:</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleProductNumberChange(value);
                    }}
                  >
                    <SelectTrigger
                      value={field.value || undefined} // Добавлено связывание значения
                      className="w-full focus:outline-none bg-dark-600 border-0 text-white"
                    >
                      <SelectValue placeholder="Select Printer by Product number" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 p-0 text-white border-0">
                      <SelectGroup className="py-4">
                        {parts.map((part: any) => (
                          <SelectItem key={part.productNumber} value={part.productNumber} className="py-2 text-white hover:bg-dark-200">
                            {part.productNumber} - {part.printerName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Part Name */}
          {partsNames.length > 0 && (
            <FormField
              control={form.control}
              name="partName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-slate-300 font-semibold">Select Part:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full focus:outline-none bg-dark-600 border-0 text-white">
                        <SelectValue placeholder="Select Part Name" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-400 p-0 text-white border-0">
                        <SelectGroup className="py-4">
                          {partsNames.map((name: string, index: number) => (
                            <SelectItem key={index} value={name} className="py-2 text-white hover:bg-dark-200">
                              {name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Other Inputs */}
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full bg-dark-600 text-white border-0" placeholder="Barcode" />
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
                <FormLabel className="text-base text-slate-300 font-semibold">Location:</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full bg-dark-600 text-white border-0" placeholder="Location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Add Part"}
          </Button>
        </form>
      </Form>
    </div>
  );
}