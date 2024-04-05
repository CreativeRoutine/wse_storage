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
      sn:"",
      barcode:"",
      printers: [],
    },
  });

  // 2. Define a submit handler.
  // addPalletSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPalletSchema>) {
    setIsSubmitting(true);

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      await createPalet({
        sn: values.sn,
        barcode: values.barcode,
        // location: values.location,
        printers: values.printers,
        creator: JSON.parse(mongoUserId),
        path: usepathname,
        
      })
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      router.push("/storage")
    } catch (error) {
      console.error(error); 
    }
  }

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "printers") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("printers", {
            type: "required",
            message: "Tag must be less than 15 characters.",
          });
        }

        // here we check if the tag is already in the array
        if (!field.value.includes(tagValue as never)) {
          form.setValue("printers", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("printers");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handlePrinterRemove = (printer: string, field: any) => {
    const newPrinters = field.value.filter((t: string) => t !== printer);

    form.setValue("printers", newPrinters);
  };


  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-6'>
              <div className="w-1/2">

                <div className="mb-4 text-lg text-slate-300 font-semibold">Add Pallet:</div>

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
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="5-12 symbols"
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
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="5-8 symbols"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Item #3 */}
                {/* <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="text-base text-slate-300 font-semibold">Location:</FormLabel>
                      <FormControl>
                        <div className="flex">                  
                        <Input
                            className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Location 5-8 symbols"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <div className="w-1/2">

                <div className="mb-4 text-lg text-slate-300 font-semibold">Add Printers:</div>

                {/* Item #3 */}
                <FormField
                  control={form.control}
                  name="printers"
                  render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel className="text-base text-slate-300 font-semibold">Printers:</FormLabel>
                        <FormControl className="mt-3.5">
                          <>
                            <Input
                              className="w-full ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Add printer's serial number and press 'Enter'"
                              onKeyDown={(e) => handleInputKeyDown(e, field)}
                            />

                            {field.value.length > 0 && (
                              <div className="flex flex-start flex-wrap mt-2.5 gap-2.5">
                                {field.value.map((printer: any) => (
                                  <Badge
                                    key={printer}
                                    className="subtle-medium bg-white flex items-center justify-center gap-2 round-md border-none px-4 py-2 caitalize"
                                    onClick={() => handlePrinterRemove(printer, field)}
                                  >
                                    S/N {printer}
                                    <Image
                                      src="/assets/icons/close.svg"
                                      width={12}
                                      height={12}
                                      alt="close icon"
                                      className="cursor-pointer object-contain invert-0 dark:invert"
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </>
                        </FormControl>
                        <FormDescription className="text-sm text-slate-400">
                          Add up to 30 printers (serial numbers) to pallet. You
                          need to press enter after each printer.
                        </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                {/* <Button type="button" className="bg-primary-500 text-white text-md mt-3" onClick={()=>handleAddPrinter("sdfs")}>Add printer</Button> */}
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