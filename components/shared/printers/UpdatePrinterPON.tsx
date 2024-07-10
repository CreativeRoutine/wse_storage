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
import { updatePrinterPONSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updatePrinterPON } from '@/lib/actions/printer.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
  mongoUserId: string;
}

export default  function UpdatePrinerPON ({mongoUserId, id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // updatePrinterPONSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof updatePrinterPONSchema>>({
    resolver: zodResolver(updatePrinterPONSchema),
    defaultValues: {
      ponumber: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updatePrinterPONSchema>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response:any = await updatePrinterPON({
        _id: id,
        ponumber: values.ponumber, 
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/printers/${id}`)

      return toast({
        title: response ? "Printer's PO number updated successfully!" : "Printer's PO number can't be updated!",
        variant: response ? 'default' : 'custom',
      })

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
                  name="ponumber"
                  render={({ field }) => (
                      // First Input
                      <FormItem>
                      <FormControl>
                          <div className="flex">
                          <Input
                              className="w-auto ouline-none bg-dark-400 text-white border-0 rounded-lg no-focus"
                              placeholder="PO number"
                              {...field}
                          />
                          </div>
                      </FormControl>

                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <Button type="submit" className="w-auto bg-primary-100 text-white" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Changing ...'}
                        </>
                      ) : (
                        <>
                        {'Update PON'}
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