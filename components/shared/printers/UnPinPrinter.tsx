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
import { unPinPrinterSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { unPinPrinter } from '@/lib/actions/printer.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
  printerId: string;
  mongoUserId: string;
}

export default  function UnPinPrinter ({id, printerId}:Props){
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // unPinPrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof unPinPrinterSchema>>({
    resolver: zodResolver(unPinPrinterSchema),
    defaultValues: {
      id: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response: any = await unPinPrinter({
        id: JSON.parse(JSON.stringify(id)),
        printerId: JSON.parse(JSON.stringify(printerId)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage/${id}`)

      return toast({
        title: response ? "Printer unpinned successfully!" : "Printer already deleted!",
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