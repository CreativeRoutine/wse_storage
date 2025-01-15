"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateBarcodeSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { createPrinter } from '@/lib/actions/printer.action';
import {generateBarcode} from '@/lib/actions/barcodes.action';
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

const SubmitType:any = 'create';

interface Props {
  barcodes: any;
  setTempBarcodes: any;
}

export default function CreatePrinter ({barcodes, setTempBarcodes}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barcodeType, setBarcodeType] = useState('WSE-P');
  const router = useRouter();
  const usepathname = usePathname();

  function handleUserSelect(type: string) {
      setBarcodeType(type);
  }

  // 1. Define your form.
  // generateBarcodeSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof generateBarcodeSchema>>({
    resolver: zodResolver(generateBarcodeSchema),
    defaultValues: {
      type: barcodeType,
      start: 0,
      finish: 0,
      
    },
  });

  // 2. Define a submit handler.
  // generateBarcodeSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof generateBarcodeSchema>) {
    setIsSubmitting(true);
  
    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);
  
    try {
      const response = await generateBarcode({
        // ponumber: JSON.parse(JSON.stringify(values.ponumber)),
        type: JSON.parse(JSON.stringify(barcodeType)),
        start: values.start,
        finish: values.finish,
        path: usepathname,
      });
  
      setIsSubmitting(false); // Reset isSubmitting state
  
      if (response.success) {

        setTempBarcodes({type: barcodeType, start: values.start, finish: values.finish});

        form.reset({}); 
      
        // Show success toast
        toast({
          title: response.message,
          variant: 'default',
        });
      } else {
        // Show error toast
        toast({
          title: response.message,
          // description: response.info,
          variant: 'custom',
        });
      }

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

  async function onSubmit__NEW(values: z.infer<typeof generateBarcodeSchema>) {
    setIsSubmitting(true);
  
    try {
      if (barcodeType === "WSE-W") {
        // Validate input format for WSE-W
        const isValidFormat = /^[0-9]+-[A-Z][0-9]+$/.test(values.start);
        if (!isValidFormat) {
          toast({
            title: "Invalid format",
            description: "Please use the format '1-A1' for warehouse barcodes.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
  
      const response = await generateBarcode({
        type: barcodeType,
        start: values.start,
        finish: values.finish,
        path: usepathname,
      });
  
      setIsSubmitting(false);
  
      if (response.success) {
        setTempBarcodes({ type: barcodeType, start: values.start, finish: values.finish });
  
        toast({
          title: response.message,
          variant: "default",
        });
      } else {
        toast({
          title: response.message,
          variant: "custom",
        });
      }
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
      setIsSubmitting(false);
      toast({
        title: "Unexpected Error",
        description: "An error occurred while creating the barcode. Please try again.",
        variant: "destructive",
      });
    }
  }

 

  return (
    <div className="bg-secondary-200  w-full ">

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
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode type:</FormLabel>
                        <div className="flex">
                          <Select
                            onValueChange={handleUserSelect}
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

                                  {/* <SelectItem
                                    value="WSE-W"
                                    className="py-2 text-white hover:bg-dark-200"
                                  >
                                    WSE-W
                                  </SelectItem> */}
                                
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
                            type="text"
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Start barcode (e.g., 1-A1)"
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
                            type="number"
                              className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Last barcode number"
                              {...field}
                              onChange={(e) => {
                                const value = Number(e.target.value); // Преобразование в число
                                field.onChange(e); // Обновление формы
                                
                              }}
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
                    {SubmitType === 'edit' ? 'Editing ...' : 'Generating ...'}
                  </>
                ) : (
                  <>
                  {SubmitType === 'edit' ? 'Edit pallet' : 'Generate barcodes'}
                  </>
                )}
              </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}