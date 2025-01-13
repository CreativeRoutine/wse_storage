
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
import { addPalletToSuppliersName } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { addPalletToSupplier, updateSupplier } from '@/lib/actions/supplier.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
}

export default function AddPalletToSupplier ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPalletToSuppliersName took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPalletToSuppliersName>>({
    resolver: zodResolver(addPalletToSuppliersName),
    defaultValues: {
      barcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addPalletToSuppliersName>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number
    const createdOn = new Date();

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response = await addPalletToSupplier({
        _id: id,
        barcode: values.barcode, 
        createdOn: createdOn,
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/supplier/${id}`)

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

          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-auto">
                  <div className='w-full flex flex-row justify-start items-center gap-2'>
                    <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                        // First Input
                        <FormItem>
                        <FormControl>
                            <div className="flex">
                            <Input
                                className="w-full ouline-none bg-dark-400 text-white border-0 rounded-lg no-focus"
                                placeholder="Barcode or shipment ID"
                                {...field}
                            />
                            </div>
                        </FormControl>

                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-auto bg-primary-500 text-white font-bold" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                            {'Adding ...'}
                            </>
                        ) : (
                            <>
                            {'Add pallet / Shipment'}
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