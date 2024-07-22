"use client";

import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPrinterSchema, printerSearchSchema,printerWorkerNameSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { createPrinter, getPrinterByBarcode } from '@/lib/actions/printer.action';

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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

export default  function RefurbishPrinter () {
  
    const { toast } = useToast();

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const usepathname = usePathname();

    const [printer, setPrinter] = useState([]) 

    // ===============================================================
    // 1. Worker Name form.
    // ===============================================================
    const formName = useForm<z.infer<typeof printerWorkerNameSchema>>({
      resolver: zodResolver(printerWorkerNameSchema),
      defaultValues: {
        techName: "",
      },
    });

    async function onSubmitName(values: z.infer<typeof printerWorkerNameSchema>) {
      setCurrentUser(values.techName)
    }
    // ===============================================================

    // ===============================================================
    // 2. Search form.
    // ===============================================================
    const formSearch = useForm<z.infer<typeof printerSearchSchema>>({
      resolver: zodResolver(printerSearchSchema),
      defaultValues: {
        barcode: "",
      },
    });

    async function onSubmitSearch(values: z.infer<typeof printerSearchSchema>) {
      setIsSearching(true);
      try {
        const response = await getPrinterByBarcode({
          barcode: values.barcode,
          path: usepathname,
        })

        setPrinter(JSON.parse(JSON.stringify(response.printer)));

        form.reset({});

      } catch (error) {
        console.error("Error searching printer:", error);
      } finally {
        setIsSearching(false);
      }
    }
    // ===============================================================
  
    // ===============================================================
    // 3. Data form.
    // ===============================================================

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
          router.push("/printer")
  
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
        console.error("Error creating printer:", error);
        setIsSubmitting(false);
      }
    }
    // ===============================================================

    

    
  
    return (
      <>
        <div className="mb-2 bg-secondary-200 px-8 py-6 w-full rounded-xl border border-dark-350 shadow-lg">

          <div className='px-4 py-6 rounded-lg bg-dark-100 mb-4'>
            <div className=' flex justify-between'>
              {!currentUser ? (<div className="text-red-500">'No user selected'</div>) : (<div className="text-green-500 text-lg font-semibold">{currentUser}</div>) }
              V-bc0003
            </div>
            <div>
            {printer ? JSON.stringify(printer.sn, null, 2) : "No printer found"}
            
            </div>

          </div>
    
          {/* ======================================================================= */}
          {/* NAME */}
          {/* ======================================================================= */}
          <div className="mb-6 ">
            <Form {...formName}>
              <form className="space-y-4 w-full mx-auto mb-6">
                <div className='flex items-end gap-2'>
                  {/* Input */}
                  <div className="w-full flex flex-col mb-0">
                    <div className="mb-4 text-lg text-slate-300 font-semibold0">Search printer by barcode:</div>
                    <FormField
                      control={formName.control}
                      name="techName"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Search:</FormLabel> */}
                          <FormControl>
                            <div className="flex">
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value); // Update the form field value
                                  formName.handleSubmit(onSubmitName)(); // Submit the form
                                }}
                              >
                                
                                <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                                  <SelectValue placeholder="Worker name" />
                                </SelectTrigger>

                                <SelectContent id="mySelect" className="bg-dark-200 p-0 text-white">
                                  <SelectGroup className="py-4" >
                                    <SelectLabel>Techs:</SelectLabel>
                                    <SelectItem value="apple" className='py-2 hover:bg-dark-400'>Vitalli</SelectItem>
                                    <SelectItem value="banana" className='py-2 hover:bg-dark-400'>Alex</SelectItem>
                                    <SelectItem value="blueberry" className='py-2 hover:bg-dark-400'>Michael</SelectItem>
                                    <SelectItem value="grapes" className='py-2 hover:bg-dark-400'>Rian</SelectItem>
                                    <SelectItem value="pineapple" className='py-2 hover:bg-dark-400'>Yurii</SelectItem>
                                  </SelectGroup>
                                </SelectContent>

                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div> 
          {/* ======================================================================= */}
          

          {/* ======================================================================= */}
          {/* PRINTER SEARCH */}
          {/* ======================================================================= */}
          <div className="mb-6">
            <Form {...formSearch}>
              <form onSubmit={formSearch.handleSubmit(onSubmitSearch)} className="space-y-4 w-full mx-auto mb-6">
                <div className='flex items-end gap-2'>
                  {/* Input */}
                  <div className="w-full flex flex-col mb-0">
                    <div className="mb-4 text-lg text-slate-300 font-semibold0">Search printer by barcode:</div>
                    <FormField
                      control={formSearch.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Search:</FormLabel> */}
                          <FormControl>
                            <div className="flex">
                              <Input
                                className="w-full h-[48px] ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                                placeholder="Printer's barcode ..."
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Button */}
                  <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-auto max-w-[190px] p-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        {type === 'edit' ? 'Searching ...' : 'Searching ...'}
                      </>
                    ) : (
                      <>
                      {type === 'edit' ? 'Search pallet' : 'Search printer'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div> 
          {/* ======================================================================= */}
          
          
          {/* ======================================================================= */}
          {/* REFURBISHING */}
          {/* ======================================================================= */}
          <div className="mb-6">  
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
          {/* ======================================================================= */}

        </div>
      </>
    )
}