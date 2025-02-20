
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
import { updateMakeName } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updateMake } from '@/lib/actions/makes.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"


const type:any = 'create';

interface Props {
  id: string;
}

export default function UpdateMakeName ({id}:Props){
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // updateMakeName took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof updateMakeName>>({
    resolver: zodResolver(updateMakeName),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateMakeName>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response:any = await updateMake({
        _id: id,
        name: values.name, 
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/settings/makes/${id}`)

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
                                placeholder="Printer's make"
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