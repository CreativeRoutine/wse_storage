"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addInvoiceNumberSchema } from "@/lib/validations";
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
import { addPrinterInvoiceNumber } from '@/lib/actions/printer.action';


const type:any = 'create';
interface Props {
  id: string;
}

export default function AddInvoiceNumber ({ id }: Props){

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addInvoiceNumberSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addInvoiceNumberSchema>>({
    resolver: zodResolver(addInvoiceNumberSchema),
    defaultValues: {
      invoiceNumber:"",
      
    },
  });

  // 2. Define a submit handler.
  // addInvoiceNumberSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addInvoiceNumberSchema>) {
    setIsSubmitting(true);

    const createdOn = new Date();

    try {


      //This is the function that will be called when the form is submitted.
      // it changed to return a response from the createPalet function and then display a toast message
      const response:any = await addPrinterInvoiceNumber({
        _id: id,
        invoiceNumber: JSON.parse(JSON.stringify(values.invoiceNumber)),
        path: usepathname,
      });

      console.log(response.id)
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      router.refresh()
      
      

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
    

      <div className="mt-8 border-t border-slate-400">
        <div className="!text-white !text-xl font-semibold mt-6 pb-2 ">Add invoice number</div>
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mx-auto">

            <div className='flex gap-6'>
              <div className="w-full">

                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    // First Input
                    <FormItem className='mb-4'>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="outline-none bg-dark-400 text-base text-slate-300 border-0 rounded-lg no-focus resize-none p-4 w-full"
                            placeholder="Invoice #"
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




              <Button type="submit" className="bg-primary-500 text-white w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {type === 'edit' ? 'Editing ...' : 'Adding ...'}
                  </>
                ) : (
                  <>
                  {type === 'edit' ? 'Edit pallet' : 'Add invoice number'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>



  )
}