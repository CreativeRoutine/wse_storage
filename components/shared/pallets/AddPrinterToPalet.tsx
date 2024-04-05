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

import { createPrinter } from '@/lib/actions/printer.action';
import { productPrinterSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updatePalet } from '@/lib/actions/pallet.action';
// import { updatePalet } from '@/lib/actions/pallet.action';

const type:any = 'create';

interface Props {
  sn: string;
  mongoUserId: string;
}

export default  function AddPrinterToPalet ({sn, mongoUserId}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const serial = sn;
  // console.log("THIS IS SERIAL FROM AddPrinerToPalet file", serial)

  // 1. Define your form.
  // productPrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof productPrinterSchema>>({
    resolver: zodResolver(productPrinterSchema),
    defaultValues: {
      sn: "",
      pnum: "",
      barcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof productPrinterSchema>,) {
    setIsSubmitting(true);
    console.log("mainFunction ADD PRINTER TO PALET")
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      await createPrinter({
        sn: values.sn, 
        pnum: values.pnum,
        barcode: values.barcode,
        paletSn: sn,
        path: usepathname,
      })

      // add function which will update the pallet with the new printers
      await updatePalet({
        paletSn: sn,
        printerSn: values.sn,
        path: usepathname,
      })

      form.reset({}); // Reset form fields
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage/${serial}`)

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>
      <div className="bg-secondary-200 px-8 py-6  rounded-xl border border-dark-350 shadow-lg">
        <div className="">
          <div className=" text-lg text-slate-300 font-semibold">
            
            {
                <>
                  <Form {...form}>    
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full mx-auto">

                      {/* Item #1 */}
                      <FormField
                        control={form.control}
                        name="sn"
                        render={({ field }) => (
                          // First Input
                          <FormItem>
                            
                            <FormControl className=''>
                              <div className="flex flex-row gap-2">
                                <Input
                                  className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                                  placeholder="Serial number"
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
                        name="pnum"
                        render={({ field }) => (
                          // First Input
                          <FormItem>
                            
                            <FormControl>
                              <div className="flex flex-row gap-2">                  
                              <Input
                                  className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                                  placeholder="Product number"
                                  {...field}
                                />
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Item #3 */}
                      <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => (
                          // First Input
                          <FormItem>
                            
                            <FormControl>
                              <div className="flex flex-row gap-2">                  
                              <Input
                                  className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                                  placeholder="barcode"
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
                              {'Adding ...'}
                            </>
                          ) : (
                            <>
                            {'Add printer'}
                            </>
                          )}
                        </Button>
                    </form>
                  </Form>
                </>
             
            }
          </div>
        </div>
      </div>
    </>

  )
}