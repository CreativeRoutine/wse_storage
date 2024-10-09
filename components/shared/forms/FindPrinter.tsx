"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { findPrinterSchema } from "@/lib/validations";
import { usePathname} from 'next/navigation';
import { findPrinter } from '@/lib/actions/printer.action';
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
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  setPrinterID: any;
}

export default function FindPrinter ({ setPrinterID }: Props){

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const usepathname = usePathname();

  // 1. Define your form.
  const form = useForm<z.infer<typeof findPrinterSchema>>({
    resolver: zodResolver(findPrinterSchema),
    defaultValues: {
      barcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof findPrinterSchema>) {
    setIsSubmitting(true);

    try {
      const response = await findPrinter({
        barcode: values.barcode
      });

      console.log("Find result", response);

      setIsSubmitting(false);

      if (response.success) {
        toast({
          title: response.message,
          variant: 'default',
        });

        // Передача данных принтера в setPrinterID
        setPrinterID(response.printer);

        // Сброс формы
        form.reset();
      } else {
        toast({
          title: "Printer was not found in database!",
          description: "Check the serial number or barcode.",
          variant: 'custom',
        });
      }

    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
      setIsSubmitting(false);
    }
  }

  return (
    <div className="my-2">
      <Form {...form}>    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

          <div className='flex gap-2 items-end'>
            <div className="w-full">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-row items-start space-y-0">
                    <FormLabel className="mb-3 text-base text-slate-300 font-semibold w-2/3">Find printer by barcode:</FormLabel>
                    <FormControl>
                      <div className="flex ml-auto min-w-[367px] gap-2">
                        <Input
                          className="w-full outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                          placeholder="S/n or barcode"
                          {...field}
                        />
                      <Button type="submit" className="bg-primary-500 text-white text-md w-full p-4 w-1/4" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            {type === 'edit' ? 'Searching ...' : 'Searching ...'}
                          </>
                        ) : (
                          <>
                          {type === 'edit' ? 'Searching' : 'Find'}
                          </>
                        )}
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
  )
}
