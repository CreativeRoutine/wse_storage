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
import { deletePalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { deletePallet } from '@/lib/actions/pallet.action';
// import { updatePalet } from '@/lib/actions/pallet.action';

const type:any = 'create';

interface Props {
  barcode: string;
  mongoUserId: string;
}

export default  function DeletePallet ({barcode}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // console.log(barcode)

  // 1. Define your form.
  // deletePalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePalletSchema>>({
    resolver: zodResolver(deletePalletSchema),
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
      await deletePallet({
        barcode: JSON.parse(JSON.stringify(barcode)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage`)

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

                  
                  <Button type="submit" onClick={onSubmit}  className="bg-red-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Deleting ...'}
                        </>
                      ) : (
                        <>
                        {'Delete pallet'}
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