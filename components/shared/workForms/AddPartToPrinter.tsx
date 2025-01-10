"use client";
import React, {useState, useEffect} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { findPrinterSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { findPrinter } from '@/lib/actions/printer.action';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"
import { addPartFromStorage, getPartsByProductNumber } from '@/lib/actions/parts.action';

const type:any = 'create';

interface Props {
  printer: any;
  partName: string;
  reset: boolean;
}

export default function FindPrinter ({ printer, partName, reset }: Props){
  const { toast } = useToast();
  const [isValidInput, setIsValidInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // 1. Define your form.
  // findPrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof findPrinterSchema>>({
    resolver: zodResolver(findPrinterSchema),
    defaultValues: {
      barcode:"",
    },
  });

  // 2. Define a submit handler.
  // findPrinterSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof findPrinterSchema>) {
    setIsSubmitting(true);

    // console.log("PRINTER TO EST PRODUCT NUM", printer)

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      const response:any = await addPartFromStorage({
        productNumber: JSON.parse(JSON.stringify(printer)),
        partName: partName,
        barcode: values.barcode,
      })

      setIsSubmitting(false); // Reset isSubmitting state
        
      response && response.success ? ( toast({
        title: response.message,
        variant: 'default',
      }), setIsValidInput(true)) :(
        toast({
          title: response.message,
          variant: 'custom',
        })
      )


        
      form.reset({}); // Reset form fields
      
    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
    }
  }

  useEffect(() => {
    if (reset) {
      setIsValidInput(false); // Сбрасываем выбранное значение
      // form.reset({ option: "" }); // Сбрасываем поле в форме
      // if (onResetComplete) {
      //   onResetComplete(); // Вызываем колбэк после сброса
      // }
    }
  }, [reset, form]);

  return (
    <>
      <div className='text-white'>{printer ? printer : "No load"}, {partName ? partName : "No load"}</div>
      <Form {...form}>    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto mt-4">

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              // First Input
              <FormItem>
                <FormLabel className={`text-slate-300 text-md font-semibold transition-all ${
                  isValidInput ? "text-green-500" : "text-slate-300"
                }`}>Barcode</FormLabel>

                <FormControl>
                  <div className="w-full flex flex-row gap-2">
                    <Input
                      {...field}
                      className="w-2/4 outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                      placeholder="Barcode"
                    />
                    <Button
                      type="submit"
                      className="bg-primary-500 opacity-70 hover:opacity-100 text-white text-md w-2/4 p-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add part"}
                    </Button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  )
}