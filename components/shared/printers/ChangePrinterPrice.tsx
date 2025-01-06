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
import { addCostToPrinterSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import { updateSupplierPalletCostAndPrinters } from '@/lib/actions/supplier.action';
import { addPrinterCost } from '@/lib/actions/printer.action';

const type:any = 'create';

interface Props {
  id: string;
}

export default  function AddCostToPrinter ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addCostToPrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addCostToPrinterSchema>>({
    resolver: zodResolver(addCostToPrinterSchema),
    defaultValues: {
      price: 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addCostToPrinterSchema>,) {
    console.log("Pallet start")
    setIsSubmitting(true);
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response: any = await addPrinterCost(
        Number(values.price),
        id,
        usepathname,
      )

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.refresh()

      return (
        response.success ? toast({
          title: response.message,
          variant: 'default',
        }) : toast({
          title: response.message,
          description: response.info,
          variant: 'custom',
        })
      )

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>
      <div className="ml-4">
        <div className="">
          <div className=" text-slate-300 font-semibold">
          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-2 items-center">

                  {/* Item #1 */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="">
                          
                            <Input
                              type="number"
                              className="w-[70px] ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder=""
                              {...field}
                              value={field.value || ""} // Обработка пустого значения
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Преобразование в число
                            />
                          
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-slate-800 hover:bg-primary-500 text-white" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Adding ...'}
                        </>
                      ) : (
                        <>
                        {'Add'}
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