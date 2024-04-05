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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addPartSchema } from "@/lib/validations";
import { createPartModel } from '@/lib/actions/part.action';
import {useRouter, usePathname} from 'next/navigation';

const type:any = 'create';

interface Props {
  mongoUserId: string;
}

export default  function AddPartForm({mongoUserId}:Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();


  // 1. Define your form.
  // addPartSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPartSchema>>({
    resolver: zodResolver(addPartSchema),
    defaultValues: {
      pn: "",
      name: "",

    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addPartSchema>) {
    setIsSubmitting(true);

    try {
      // this function took from lib/actions/printer.action.ts to create a new printer model
      await createPartModel({
        pn: values.pn,
        name: values.name,
        path: usepathname,
      })

      form.reset({}); // Reset form fields
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push("/settings")
    } catch (error) {
      console.error(error); 
    }
  }

  // 3. Render the form.
  return (
    <div className="w-1/2 bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

    <div className="mb-4">
      <div className="mb-3 text-lg text-slate-300 font-semibold">Add Part:</div>
      {/* ======================================================================= */}
    <Form {...form}>    
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-full mx-auto">

        {/* Item #1 */}
        <FormField
          control={form.control}
          name="pn"
          render={({ field }) => (
            // First Input
            <FormItem>
              <FormLabel className="mb-3 text-lg text-slate-300 font-semibold">Part product/number:</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2">
                  <Input
                    className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                    placeholder="pn1234567hp"
                    {...field}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Item #2 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            // First Input
            <FormItem>
              <FormLabel className="mb-3 text-lg text-slate-300 font-semibold">Part name:</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2">                  
                <Input
                    className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                    placeholder="Eg. Left side panel"
                    {...field}
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
                {type === 'edit' ? 'Editing ...' : 'Adding ...'}
              </>
            ) : (
              <>
              {type === 'edit' ? 'Edit printer' : 'Add printer'}
              </>
            )}
          </Button>
      </form>
    </Form>

    </div>


    </div>
  );
}
