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
import { addCostToPalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updatePaletCost } from '@/lib/actions/pallet.action';
// import { updatePalet } from '@/lib/actions/pallet.action';

const type:any = 'create';

interface Props {
  barcode: string;
  mongoUserId: string;
}

export default  function AddCostToPallet ({barcode}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addCostToPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addCostToPalletSchema>>({
    resolver: zodResolver(addCostToPalletSchema),
    defaultValues: {
      price: "0",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addCostToPalletSchema>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      await updatePaletCost({
        price: values.price, 
        paletBarcode: barcode,
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage/${barcode}`)

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>
      <div className="bg-secondary-200 px-8 py-6  rounded-xl border border-dark-350 shadow-lg">
        <div className="">
          <div className=" text-lg text-slate-300 font-semibold">
          <div className='font-bold text-md mb-4'>Add costs</div>
          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full mx-auto">

                  {/* Item #1 */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      // First Input
                      <FormItem>
                        
                        <FormControl className=''>
                          <div className="flex flex-row gap-2">
                            <Input
                              className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="100..."
                              {...field}
                            />
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                  }
                  />
                  <Button type="submit" className="bg-primary-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Changing ...'}
                        </>
                      ) : (
                        <>
                        {'Add Price'}
                        </>
                      )}
                  </Button>
                </form>
              </Form>
            </>
          }
          </div>
        </div>
      </div>
    </>

  )
}