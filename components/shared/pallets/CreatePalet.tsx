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
import { useToast } from "@/components/ui/use-toast"


const type:any = 'create';
interface Props {
  mongoUserId: string;
}

export default function CreatePalet ({ mongoUserId }: Props){

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPalletSchema>>({
    resolver: zodResolver(addPalletSchema),
    defaultValues: {
      barcode:"",
      // location:"",
    },
  });

  // 2. Define a submit handler.
  // addPalletSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPalletSchema>) {
    setIsSubmitting(true);

    const createdOn = new Date();

    try {


      //This is the function that will be called when the form is submitted.
      // it changed to return a response from the createPalet function and then display a toast message
      const response:any = await createPalet({
        barcode: JSON.parse(JSON.stringify(values.barcode)),
        path: usepathname,
        
      });
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      router.push(`/storage/${response.paletId}`); // Redirect to the newly created pallet
      

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
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-6'>
              <div className="w-full">

                <div className="mb-4 text-lg text-slate-300 font-semibold">Create pallet for storage:</div>

                
                {/* Item #2 */}
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    // First Input
                    <FormItem className='mb-4'>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Barcode"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className='text-red-500 mb-4'/>
                    </FormItem>
                  )}
                />

              {/* <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    // First Input
                    <FormItem className='mb-4'>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Location (may leave empty):</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="location"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className='text-red-500'/>
                    </FormItem>
                  )}
                /> */}
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