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
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
  mongoUserId: string;
}

export default  function DeletePallet ({id}:Props){
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // deletePalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePalletSchema>>({
    resolver: zodResolver(deletePalletSchema),
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
      const response = await deletePallet({
        id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage`)

      return toast({
        title: response ? "Pallet deleted successfully!" : "An error occurred while deleting the printer",
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