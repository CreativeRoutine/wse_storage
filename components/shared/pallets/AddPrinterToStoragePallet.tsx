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

import { addPrinterToStoragePalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import { addPrinterToSupplierPallet } from '@/lib/actions/supplier.action';
import { addPrinterToStoragePallet } from '@/lib/actions/pallet.action';

const type:any = 'create';

interface Props {
  id: string;
}

export default  function AddPrinterToPalet ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPrinterToStoragePalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPrinterToStoragePalletSchema>>({
    resolver: zodResolver(addPrinterToStoragePalletSchema),
    defaultValues: {
      barcode: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addPrinterToStoragePalletSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response: any = await addPrinterToStoragePallet({
        palletId: id,
        barcode: values.barcode,
        path: usepathname,
      })

      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.refresh();
      
      
      if (response.success) {
        // Reset form fields
        form.reset({}); 
      
        // Show success toast
        toast({
          title: response.message,
          variant: 'default',
        });
      } else {
        form.reset({});
        // Show error toast
        toast({
          title: response.message,
          description: response.info,
          variant: 'custom',
        });
      }
      
      


    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>
      <div className="bg-secondary-200 px-8 py-6  rounded-xl border border-dark-350 shadow-lg">
        <div className="">
          <div className=" text-lg text-slate-300 font-semibold">
            <div className='font-bold text-md mb-4'>Add printer (from Supplier's pallet)</div>

          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full mx-auto">

                  {/* Item #1 */}
                  {/* <FormField
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
                  /> */}

                  {/* Item #2 */}
                  {/* <FormField
                    control={form.control}
                    name="productNumber"
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
                  /> */}

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