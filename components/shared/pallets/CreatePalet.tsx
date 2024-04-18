"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPalletSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { createPalet } from '@/lib/actions/pallet.action';
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
import { Badge } from '@/components/ui/badge';
import  Image from 'next/image';

const type:any = 'create';

interface Props {
  mongoUserId: string;
}

export default function CreatePalet ({ mongoUserId }: Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPalletSchema>>({
    resolver: zodResolver(addPalletSchema),
    defaultValues: {
      ponumber:"",
      barcode:"",
    },
  });

  // 2. Define a submit handler.
  // addPalletSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPalletSchema>) {
    setIsSubmitting(true);

    const createdOn = new Date();

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      await createPalet({
        ponumber: JSON.parse(JSON.stringify(values.ponumber)),
        barcode: JSON.parse(JSON.stringify(values.barcode)),
        user: JSON.parse(JSON.stringify(mongoUserId)),
        path: usepathname,
        createdOn: createdOn
      })
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      router.push("/storage")
    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-6'>
              <div className="w-full">

                <div className="mb-4 text-lg text-slate-300 font-semibold">Add Pallet:</div>

                <FormField
                  control={form.control}
                  name="ponumber"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">PO number:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="PO number"
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
                  name="barcode"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Barcode"
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




              <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {type === 'edit' ? 'Editing ...' : 'Adding ...'}
                  </>
                ) : (
                  <>
                  {type === 'edit' ? 'Edit pallet' : 'Add pallet'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}