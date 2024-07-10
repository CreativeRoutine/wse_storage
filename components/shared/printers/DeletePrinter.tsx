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
import { deletePrinter } from '@/lib/actions/printer.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';
interface Props {
  id: string;
  mongoUserId: string;
}

export default  function DeletePrinter ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // deletePrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePrinterSchema>>({
    resolver: zodResolver(deletePrinterSchema),
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
      const response = await deletePrinter({
        id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/printers`)

      response ? ( toast({
        title: "Printer deleted successfully!",
        variant: 'default',
      })) :(
        toast({
          title: "Printer can't be deleted!",
          description: "Try update page or contact with support.",
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">

                  
                  <Button type="submit" onClick={onSubmit}  className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Deleting ...'}
                        </>
                      ) : (
                        <>
                        {'Delete printer'}
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