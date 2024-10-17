
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
import { updateMakePreviewScheme } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { updateMake } from '@/lib/actions/makes.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"
import {previewLinks} from '@/constants/index';
import {updateMakePreview} from '@/lib/actions/makes.action';

const type:any = 'create';

interface Props {
  id: string;
}

export default function UpdateMakePreview ({id}:Props){
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // updateMakePreview took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof updateMakePreviewScheme>>({
    resolver: zodResolver(updateMakePreviewScheme),
    defaultValues: {
      preview: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateMakePreviewScheme>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response:any = await updateMakePreview({
        _id: id,
        preview: values.preview, 
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/make/${id}`)

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
    <>
      {
        <>
          <Form {...form}>  
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
              <div className='w-full'>
                <FormField
                  control={form.control}
                  name="preview"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                    <FormControl>
                        <div className="flex w-full">
                        {/* <Input
                            className="w-auto ouline-none bg-dark-400 text-white border-0 rounded-lg no-focus"
                            placeholder="Printer's make"
                            {...field}
                        /> */}
                        <Select
                          onValueChange={(value) => {
                              field.onChange(value); // Update the form field value
                              form.handleSubmit(onSubmit)(); // Submit the form
                          }}
                          >
                          
                          <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0 bg-dark-400 text-left border-0 border-slate-300 text-slate-400">
                              <SelectValue placeholder="Printer's preview" className="text-left ml-0" />
                          </SelectTrigger>

                          <SelectContent id="mySelect" className="bg-dark-400 p-0 text-white border-0">
                              <SelectGroup className="py-4 w-full" >
                              {/* <SelectLabel className='text-lg font-bold border-b border-white'>Techs:</SelectLabel> */}
                              {
                                previewLinks.map((preview: { make: string; route: string })=>(
                                  <SelectItem key={preview.make} value={preview.route} className='py-2 text-white hover:bg-dark-200'>{preview.make}</SelectItem>    
                                  ))
                              }
                              </SelectGroup>
                          </SelectContent>
                          </Select>
                        </div>
                    </FormControl>

                    <FormMessage />
                    </FormItem>
                )}
                />
                {/* <Button type="submit" className="w-auto bg-primary-100 text-white" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                        {'Updating ...'}
                        </>
                    ) : (
                        <>
                        {'Update Preview'}
                        </>
                    )}
                </Button> */}
              </div>
            </form>
          </Form>
        </>
      }
    </>
  )
}