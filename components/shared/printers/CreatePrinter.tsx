"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPrinterSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { createPrinter } from '@/lib/actions/printer.action';
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
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  mongoUserId: string;
}

export default function CreatePrinter ({ mongoUserId }: Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPrinterSchema>>({
    resolver: zodResolver(addPrinterSchema),
    defaultValues: {
      ponumber: "",
      sn: "",
      productNumber:"",
      barcode:"",
    },
  });

  // 2. Define a submit handler.
  // addPrinterSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPrinterSchema>) {
    setIsSubmitting(true);


    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      const response = await createPrinter({
        ponumber: JSON.parse(JSON.stringify(values.ponumber)),
        sn: JSON.parse(JSON.stringify(values.sn)),
        productNumber: JSON.parse(JSON.stringify(values.productNumber)),
        barcode: JSON.parse(JSON.stringify(values.barcode)),
        path: usepathname,
        createdOn: createdOn,
      })


        setIsSubmitting(false); // Reset isSubmitting state
        // defined as a hook
        form.reset({}); // Reset form fields
        router.push("/printers")

        response ? ( toast({
          title: "Printer created successfully!",
          variant: 'default',
        })) :(
          toast({
            title: "Printer with such Barcode already in DataBase!",
            description: "Check the serial number, product number or barcode.",
            variant: 'custom',
          })
        )
      
      
    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
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

                <div className="mb-4 text-lg text-slate-300 font-semibold">Add Printer:</div>

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

                <FormField
                  control={form.control}
                  name="sn"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Serial number:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="s/n"
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
                  name="productNumber"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Product number:</FormLabel>
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
                  {type === 'edit' ? 'Edit pallet' : 'Add printer'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}