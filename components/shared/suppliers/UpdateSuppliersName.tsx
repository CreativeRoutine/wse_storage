
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
import { updateSuppliersName } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updateSupplier } from '@/lib/actions/supplier.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
}

export default function UpdateSuppliersName ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // updateSuppliersName took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof updateSuppliersName>>({
    resolver: zodResolver(updateSuppliersName),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateSuppliersName>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response = await updateSupplier({
        _id: id,
        name: values.name, 
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/supplier/${id}`)

      return toast({
        title: response ? "Supplier updated successfully!" : "Supplier's name can't be updated!",
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
                    name="name"
                    render={({ field }) => (
                        // First Input
                        <FormItem>
                        <FormControl>
                            <div className="flex">
                            <Input
                                className="w-auto ouline-none bg-dark-400 text-white border-0 rounded-lg no-focus"
                                placeholder="Supplier name"
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
                            {'Updating ...'}
                            </>
                        ) : (
                            <>
                            {'Update Name'}
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