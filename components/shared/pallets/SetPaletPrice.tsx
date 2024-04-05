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
import {useRouter, usePathname} from 'next/navigation';
import { updatePaletCostSchema } from '@/lib/validations';
import { setPaletCost } from '@/lib/actions/pallet.action';

const type:any = 'create';

interface Props {
  sn: string;

}

export default  function SetPaletPrice ({sn}:Props){
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();
  const serial = sn;


  // 1. Define your form.
  // updatePaletCostSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof updatePaletCostSchema>>({
    resolver: zodResolver(updatePaletCostSchema),
    defaultValues: {
      sn:"",
      paletCost: "",
    },
  });

  console.log(form.formState.defaultValues)
  

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof updatePaletCostSchema>,) {
      setIsSubmitting(true);
      console.log("mainFunction")
      try {
        
        // this function took from lib/actions/printer.action.ts to create a new printer model
        await setPaletCost({
          sn: values.sn, 
          paletCost: values.paletCost,
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
      <div className="bg-secondary-200 mt-4 px-8 py-6  rounded-xl border border-dark-350 shadow-lg">
        <div className="">
          <div className=" text-lg text-slate-300 font-semibold">
            
            {
                <>
                  <Form {...form}>    
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-full mx-auto">

                      {/* Item #1 */}
                      <FormField
                        control={form.control}
                        name="paletCost"
                        render={({ field }) => (
                          // First Input
                          <FormItem>
                            
                            <FormControl className=''>
                              <div className="flex flex-row gap-2">
                                <Input
                                  className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                                  placeholder="set price"
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
                            {'Add cost'}
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