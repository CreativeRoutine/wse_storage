"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPartNameSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';

import { addPart, createPrinterPart } from '@/lib/actions/parts.action';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from 'moment-timezone';
import { useToast } from "@/components/ui/use-toast"
import path from 'path';
import { createPartsList } from '@/lib/actions/partsList.action';

const type:any = 'create';

interface Props {
  mongoUserId: string;
}

export default function AddPart ({ mongoUserId }: Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const [selectedOption, setSelectedOption] = useState(""); // Локальное состояние для выбора
  const schema = z.object({ option: z.string().nonempty() });


  // 1. Define your form.
  // addPartNameSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPartNameSchema>>({
    resolver: zodResolver(addPartNameSchema),
    defaultValues: {
      partName: "",
    },
  });

  // 2. Define a submit handler.
  // addPartNameSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof addPartNameSchema>) {
    setIsSubmitting(true);


    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    try {

      const response:any = await createPartsList({
        partName: values.partName,
        path: usepathname,
      })

      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      // router.push("/settings/parts")
      router.refresh()

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
      console.error("THIS IS AN ERROR", error); 
    }
  }


  return (
    <div className="bg-transparent px-0 mb-2 py-2 w-full rounded-xl  border-0 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-4 mb-4'>
              <div className="w-full">
                {/* Make - Product Number */}
                <FormField
                  control={form.control}
                  name="partName"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Add part to list:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Part name"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Part Name */}
                {/* <FormField
                  control={form.control}
                  name="printerName"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Part name:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Select
                            value={selectedOption} // Устанавливаем значение из состояния
                            onValueChange={(value) => {
                              setSelectedOption(value); // Обновляем состояние
                              field.onChange(value); // Обновляем поле в форме
                              // onSelect(value); // Передача выбранного значения в родительский компонент
                            }}
                          >
                            <SelectTrigger className="w-full text-slate-400 focus:text-green-500 mt-0 focus:outline-none bg-dark-600 border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0 border-slate-300">
                              <SelectValue placeholder={`Select part`}  />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-400 text-white border-0">
                              <SelectGroup>
                                {options.map((option) => (
                                  <SelectItem key={option} value={option} className='py-2 text-white hover:bg-dark-200'>{option}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Barcode */}
                {/* <FormField
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
                /> */}

                {/* Location */}
                {/* <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Part storage location:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Location"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </div>




            <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'edit' ? 'Editing ...' : 'Adding ...'}
                </>
              ) : (
                <>
                {type === 'edit' ? 'Edit pallet' : 'Add part name'}
                </>
              )}
            </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}