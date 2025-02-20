"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { findPrinterSchema } from "@/lib/validations";
import { findPrinter } from '@/lib/actions/printer.action';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  setPrinterID: (printer: any) => void;
}

export default function FindPrinter({ setPrinterID }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof findPrinterSchema>>({
    resolver: zodResolver(findPrinterSchema),
    defaultValues: {
      barcode: "",
    },
  });

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof findPrinterSchema>) {
    setIsSubmitting(true);

    try {
      const response = await findPrinter({ barcode: values.barcode });
      setIsSubmitting(false);

      if (response.success) {
        toast({
          title: response.message,
          variant: 'default',
        });
        setPrinterID(response.printer);
        form.reset();
      } else {
        toast({
          title: "Printer was not found in database!",
          description: "Check the serial number or barcode.",
          variant: 'custom',
        });
      }
    } catch (error) {
      console.error("Error finding printer:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="my-2">
      <Form {...form}>    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto mt-4">
          <div className='flex gap-2 items-end'>
            <div className="w-full">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-start space-y-0">
                    <FormLabel className="mb-2 text-normal text-slate-300 font-semibold w-2/3">Find printer by barcode:</FormLabel>
                    <FormControl>
                      <div className="w-full flex flex-row gap-2">
                        <Input
                          className="w-3/4 outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                          placeholder="S/n or barcode"
                          {...field}
                        />
                        <Button type="submit" className="bg-primary-500 text-white text-md w-1/4 p-4" disabled={isSubmitting}>
                          {isSubmitting ? 'Searching...' : 'Find'}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
