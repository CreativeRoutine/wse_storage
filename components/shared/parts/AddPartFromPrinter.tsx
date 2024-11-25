"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPartFromPrinterSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";
import { addPartFromPrinter, getPartsByProductNumber } from "@/lib/actions/parts.action";

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
import { Button } from "@/components/ui/button";
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  printerId: string;
  printerProductNumber: string;
}
interface FormData {
  partName: string;
  productNumber: string;
}

export default function AddPart({ printerId, printerProductNumber }: Props) {
  const { toast } = useToast();

  const [partsData, setPartsData] = useState<any[]>([]); // Сохраняем данные о частях принтера
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


  const form = useForm<FormData>({
    defaultValues: {
      partName: "",
      productNumber: printerProductNumber || "",
    },
  });

  


  useEffect(() => {
    if (printerProductNumber) {
      getPrinterData();
    }
  }, [printerProductNumber]);

  async function getPrinterData() {
    try {
      const response: any = await getPartsByProductNumber({
        productNumber: printerProductNumber,
      });
      const parts = JSON.parse(response); // Преобразуем строку в объект
      setPartsData(parts.parts || []); // Сохраняем данные о частях принтера
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);

    console.log("partsData =====",partsData)
    
    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);
    
    try {
      console.log("On submit")
      const response: any = await addPartFromPrinter({
        createdOn: createdOn,
        partName: values.partName,
        productNumber: printerProductNumber,
        printerId: printerId, // Опциональный ID принтера
        used: false,
      });

      setIsSubmitting(false);
      form.reset();
      // router.push(`/addpart`); // Редирект после успешного добавления

      toast({
        title: response.message,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error adding part:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-b border-slate-400 my-4">
      <div className="bg-secondary-200 mb-1 py-6 w-full lg:w-1/2 rounded-xl border border-dark-350">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
            {/* Select Part Name */}
            {partsData.length > 0 && (
              <FormField
                control={form.control}
                name="partName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-slate-300 text-md font-semibold mb-2">
                      Part to be disassembled:
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger className="w-full focus:outline-none bg-dark-600 border-0 text-white">
                          <SelectValue placeholder="Select Part Name" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 p-0 text-white border-0">
                          <SelectGroup className="py-4">
                            {partsData.map((part: any, index: number) => (
                              <SelectItem
                                key={index}
                                value={part.partsName}
                                className="py-2 text-white hover:bg-dark-200"
                              >
                                {part.partsName}
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

            <Button
              type="submit"
              className="bg-primary-500 text-white text-lg w-full p-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Remove part"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}