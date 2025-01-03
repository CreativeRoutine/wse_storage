"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addSuppliersPallet } from "@/lib/validations";
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
import { createSupplier } from '@/lib/actions/supplier.action';


const type:any = 'create';
interface Props {
  mongoUserId: string;
}

export default function CreateSupplierPallet ({ mongoUserId }: Props){

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addSuppliersPallet took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addSuppliersPallet>>({
    resolver: zodResolver(addSuppliersPallet),
    defaultValues: {
      ponumber:"",
      
    },
  });

  // 2. Define a submit handler.
  // addSuppliersPallet took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addSuppliersPallet>) {
    setIsSubmitting(true);

    console.log("Clicked")

    const createdOn = new Date();

    try {


      //This is the function that will be called when the form is submitted.
      // it changed to return a response from the createPalet function and then display a toast message
      const response:any = await createSupplier({
        ponumber: JSON.parse(JSON.stringify(values.ponumber)),
        createdOn: createdOn
      });

      console.log(response.id)
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      if(response.id){
        router.push(`/supplier/${response.id}`)
      }
      

      return (
        response.success ? toast({
          title: response.message,
          description: response.info,
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

                <div className="mb-4 text-lg text-slate-300 font-semibold">Add pallet from Supplier:</div>

                <FormField
                  control={form.control}
                  name="ponumber"
                  render={({ field }) => (
                    // First Input
                    <FormItem className='mb-4'>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">PO number:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="PO number"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage className='text-red-500'/>
                    </FormItem>
                  )}
                />
                {/* Item #2 */}

              </div>
            </div>




              <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {type === 'edit' ? 'Editing ...' : 'Adding ...'}
                  </>
                ) : (
                  <>
                  {type === 'edit' ? 'Edit pallet' : 'Add pallet from Supplier'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}