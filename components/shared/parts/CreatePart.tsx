"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPartSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';

import { addPart, createPrinterPart } from '@/lib/actions/parts.action';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  mongoUserId: string;
}

export default function AddPart ({ mongoUserId }: Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const [selectedOption, setSelectedOption] = useState(""); // Локальное состояние для выбора
  const schema = z.object({ option: z.string().nonempty() });

  // const options = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];


  // 1. Define your form.
  // addPartSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPartSchema>>({
    resolver: zodResolver(addPartSchema),
    defaultValues: {
      // productNumber:"",
      make:"",
    },
  });

  // 2. Define a submit handler.
  // addPartSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPartSchema>) {
    setIsSubmitting(true);


    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    try {


      const response:any = await createPrinterPart({
        // productNumber: values.productNumber,
        make: values.make,
      })

      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      // router.push("/settings/parts")
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
      console.error("THIS IS AN ERROR", error); 
    }
  }


  return (
    <div className="bg-transparent px-0 mb-2 py-2 w-full rounded-xl  border-0 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-4 mb-4'>
              <div className="w-full">
                {/* Make - Product Number */}
                {/* <FormField
                  control={form.control}
                  name="productNumber"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Printer's Product Number:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Product number"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Make - Product Number */}
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Printer's Make:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Printer's make e.g. HP404"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>




            <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'edit' ? 'Editing ...' : 'Creating ...'}
                </>
              ) : (
                <>
                {type === 'edit' ? 'Edit pallet' : 'Create printer part'}
                </>
              )}
            </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}