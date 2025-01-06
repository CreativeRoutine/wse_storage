"use client";

import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boolean, z } from "zod";

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

import { addPrinterToPallet } from '@/lib/actions/printer.action';
import { addPrinterToPalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import { addPrinterToSupplierPallet } from '@/lib/actions/supplier.action';
import { Checkbox } from '@/components/ui/checkbox';

const type:any = 'create';

interface Props {
  id: string;
  mongoUserId: string;
}

export default  function AddPrinterToPalet ({id}:Props){
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParts, setIsParts] = useState(false);

  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPrinterToPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPrinterToPalletSchema>>({
    resolver: zodResolver(addPrinterToPalletSchema),
    defaultValues: {
      sn: "",
      productNumber: "",
      barcode: "",
      parts: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addPrinterToPalletSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response: any = await addPrinterToSupplierPallet({
        sn: values.sn, 
        productNumber: values.productNumber,
        barcode: values.barcode,
        palletId: id,
        path: usepathname,
        parts: isParts,
      })

      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.refresh();
      
      
      if (response.success) {
        // Reset form fields
        setIsParts(false);
        form.reset({}); 
      
        // Show success toast
        toast({
          title: response.message,
          variant: 'default',
        });
      } else {
        setIsParts(false);
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
            <div className='font-bold text-md mb-4'>Add printer</div>

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

                  <FormField
                    control={form.control}
                    name="parts"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex flex-row items-center gap-2">
                            <Checkbox
                              id="parts"
                              checked={isParts}
                              onCheckedChange={(checked:any) => {
                                field.onChange(checked);
                                setIsParts(checked);
                              }}
                            />
                            <label
                              htmlFor="parts"
                              className="text-white text-base font-normal"
                            >
                              Broken or for parts
                            </label>
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