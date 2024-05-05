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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pinToPalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { PinPrinterToPallet } from '@/lib/actions/printer.action';

const type:any = 'create';

interface Props {
  barcode: string;
  mongoUserId: string;
}

export default  function PinToPalletSchema ({barcode}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // pinToPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof pinToPalletSchema>>({
    resolver: zodResolver(pinToPalletSchema),
    defaultValues: {
      barcode: "",
      palletBarcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      await PinPrinterToPallet({
        barcode: JSON.parse(JSON.stringify(barcode)),
        palletBarcode: JSON.parse(JSON.stringify(form.getValues('barcode'))),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/printers/${barcode}`)

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
                  <div className='w-full flex flex-row justify-center items-center gap-2'>
                  <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                      // First Input
                      <FormItem>
                      <FormControl>
                          <div className="flex">
                          <Input
                              className="w-auto ouline-none bg-dark-400 text-white border-0 rounded-lg no-focus"
                              placeholder="Pallet barcode"
                              {...field}
                          />
                          </div>
                      </FormControl>

                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  
                  <Button type="submit" onClick={onSubmit}  className="w-auto bg-primary-100 text-white" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Pinning ...'}
                        </>
                      ) : (
                        <>
                        {'Pin printer'}
                        </>
                      )}
                  </Button>
                  </div>
                </form>
              </Form>
            </>
          }

    </>

  )
}