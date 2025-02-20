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
import { useToast } from "@/components/ui/use-toast"
import { updateSupplierPalletCostAndPrinters } from '@/lib/actions/supplier.action';

const type:any = 'create';

interface Props {
  id: string;
}

export default  function AddCostToPallet ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addCostToPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addCostToPalletSchema>>({
    resolver: zodResolver(addCostToPalletSchema),
    defaultValues: {
      price: 0,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addCostToPalletSchema>,) {
    console.log("Pallet start")
    setIsSubmitting(true);
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response: any = await updateSupplierPalletCostAndPrinters(
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
                      <FormItem>
                        <FormControl className="">
                          <div className="flex flex-row gap-2">
                            <Input
                              type="number"
                              className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder=""
                              {...field}
                              value={field.value || ""} // Обработка пустого значения
                              onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Преобразование в число
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-primary-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Changing ...'}
                        </>
                      ) : (
                        <>
                        {'Add pallet cost'}
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