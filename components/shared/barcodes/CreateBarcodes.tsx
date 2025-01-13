"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateBarcodeSchema } from "@/lib/validations";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

// interface Props {
//   mongoUserId: string;
// }

export default function CreatePrinter (){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState('');
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // generateBarcodeSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof generateBarcodeSchema>>({
    resolver: zodResolver(generateBarcodeSchema),
    defaultValues: {
      type: "",
      start: "",
      finish:"",
      
    },
  });

  // 2. Define a submit handler.
  // generateBarcodeSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof generateBarcodeSchema>) {
    setIsSubmitting(true);
  
    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);
  
    try {
      console.log("TYPE" ,values.type, "START =>", values.start ,"FINISH =>", values.finish )
      // const response = await createPrinter({
      //   // ponumber: JSON.parse(JSON.stringify(values.ponumber)),
      //   sn: JSON.parse(JSON.stringify(values.sn)),
      //   productNumber: JSON.parse(JSON.stringify(values.productNumber)),
      //   barcode: JSON.parse(JSON.stringify(values.barcode)),
      //   path: usepathname,
      //   createdOn: createdOn,
      // });
  
      setIsSubmitting(false); // Reset isSubmitting state
  
      // if (response.success) {
      //   // Если принтер успешно создан, показываем успешное уведомление
      //   toast({
      //     title: "Printer created successfully!",
      //     variant: "default",
      //   });
      //   form.reset({}); // Reset form fields
      //   router.push("/printers");
      // } else {
      //   // Если ошибка, показываем сообщение об ошибке
      //   toast({
      //     title: "Error creating printer!",
      //     description: response.message,
      //     variant: "destructive",
      //   });
      // }
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
      setIsSubmitting(false); // Сбрасываем состояние при ошибке
      toast({
        title: "Unexpected Error",
        description: "An error occurred while creating the printer. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleUserSelect(type: string) {
    console.log("TYPE ====>", typeof type)
      setType(type);
  }

  return (
    <div className="bg-secondary-200 px-8 mb-6 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-6'>
              <div className="w-full">
                <div className="mb-4 text-lg text-slate-300 font-semibold">Create barcodes list:</div>

                <div className='flex flex-row gap-2'>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode type (department):</FormLabel>
                        <div className="flex">
                          <Select
                            // onValueChange={handleUserSelect}
                            defaultValue={field.value}
                          >
                            
                              <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                            
    
                            <SelectContent className="bg-dark-400 p-0 text-white border-0">
                              <SelectGroup className="py-4">
                                
                                  <SelectItem
                                    
                                    value="WSE-P"
                                    className="py-2 text-white hover:bg-dark-200"
                                  >WSE-P</SelectItem>

                                  <SelectItem
                                    
                                    value="WSE-PP"
                                    className="py-2 text-white hover:bg-dark-200"
                                  >WSE-PP</SelectItem>

                                  <SelectItem
                                    
                                    value="WSE-PL"
                                    className="py-2 text-white hover:bg-dark-200"
                                  >WSE-PL</SelectItem>

                                  <SelectItem
                                    
                                    value="WSE-ST"
                                    className="py-2 text-white hover:bg-dark-200"
                                  >WSE-ST</SelectItem>
                                
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      // First Input
                      <FormItem  className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Start barcode number:</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="start barcode number"
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
                    name="finish"
                    render={({ field }) => (
                      // First Input
                      <FormItem  className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Last barcode number:</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Last barcode number"
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
            </div>




              <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {type === 'edit' ? 'Editing ...' : 'Generating ...'}
                  </>
                ) : (
                  <>
                  {type === 'edit' ? 'Edit pallet' : 'Generate barcodes'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}