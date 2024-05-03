"use client";

import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { deletePrinterSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { unPinPrinter } from '@/lib/actions/printer.action';

const type:any = 'create';

interface Props {
  barcode: string;
  palletBarcode: string;
  mongoUserId: string;
}

export default  function DeletePrinter ({barcode, palletBarcode}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // deletePrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePrinterSchema>>({
    resolver: zodResolver(deletePrinterSchema),
    defaultValues: {
      barcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      await unPinPrinter({
        barcode: JSON.parse(JSON.stringify(barcode)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage/${palletBarcode}`)

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>

          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">

                  
                  <Button type="submit" onClick={onSubmit}  className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Unpinning ...'}
                        </>
                      ) : (
                        <>
                        {'Unpin printer'}
                        </>
                      )}
                  </Button>
                </form>
              </Form>
            </>
          }

    </>

  )
}