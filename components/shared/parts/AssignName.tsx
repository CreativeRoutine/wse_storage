"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { assignNameSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';

import { addPart, assignName, createPrinterPart } from '@/lib/actions/parts.action';

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

const type:any = 'create';

interface Props {
  id: string;
}

export default function AssignName ({ id }: Props){
    const { toast } = useToast();


    console.log("THIS IS ID ====>",id)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const [selectedOption, setSelectedOption] = useState(""); // Локальное состояние для выбора
  const schema = z.object({ option: z.string().nonempty() });


  // 1. Define your form.
  // assignNameSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof assignNameSchema>>({
    resolver: zodResolver(assignNameSchema),
    defaultValues: {
      name:"",
    },
  });

  // 2. Define a submit handler.
  // assignNameSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof assignNameSchema>) {
    setIsSubmitting(true);
    
    try {


      const response:any = await assignName({
        _id: id,
        name: values.name,
      })

      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      form.reset({}); // Reset form fields
      router.push("/settings/printer-parts")
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

            <div className='flex gap-4 mb-0'>
              <div className="w-full">
                {/* Make - Product Number */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Make / name:</FormLabel>
                      <FormDescription className='text-red-400'>Use this form if no printers this model were added. </FormDescription>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Type new printer name"
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

            <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'edit' ? 'Editing ...' : 'Assigning ...'}
                </>
              ) : (
                <>
                {type === 'edit' ? 'Edit pallet' : 'Assign name/make'}
                </>
              )}
            </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}