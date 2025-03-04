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

const type:any = 'create';

interface Props {
  label: string;
  printer: any;
  reset: boolean;
}

export default function FindPrinter ({ label, printer, reset }: Props){
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

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      const response = await findPrinter({
        barcode: JSON.parse(JSON.stringify(values.barcode)),
      })

      setIsSubmitting(false); // Reset isSubmitting state

      // console.log("Returns from form function",response.printer)
        
      response && response.success ? ( toast({
        title: "Printer found!",
        variant: 'default',
      }), setIsValidInput(true), printer(response.printer)) :(
        toast({
          title: "Printer with such Barcode not found!",
          description: "Check the barcode.",
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
      <Form {...form}>    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              // First Input
              <FormItem>
                <FormLabel className={`text-slate-300 text-md font-semibold transition-all ${
                  isValidInput ? "text-green-500" : "text-slate-300"
                }`}>
                  {label}
                </FormLabel>

                <FormControl>
                  <div className="w-full flex flex-row gap-2">
                    <Input
                      {...field}
                      className="w-2/4 outline-none bg-dark-600 text-slate-400 border-0 rounded-lg no-focus"
                      placeholder="Barcode"
                    />
                    <Button
                      type="submit"
                      className="bg-primary-500 text-white text-md w-2/4 p-4"
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
    </>
  )
}