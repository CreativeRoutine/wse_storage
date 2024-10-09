
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

import { Button } from "@/components/ui/button";
import { printerSearchSchema, printerWorkerNameSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { getPrinterByBarcode } from '@/lib/actions/printer.action';
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const type:any = 'create';
interface Props {
  change: any;
  users: any;
}

export default function TechFormUsers ({change, users}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // printerSearchSchema took from lib/validations.ts to validate the form
  const formName = useForm<z.infer<typeof printerWorkerNameSchema>>({
    resolver: zodResolver(printerWorkerNameSchema),
    defaultValues: {
      techName: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmitName(values: z.infer<typeof printerWorkerNameSchema>) { 
    return (
      change(values.techName)
    )
  }

  return (
    <>
      {/* Old form  */} 
      {
        <>
          <Form {...formName}>
              <form className="">
                <div className='flex flex-row w-full px-2'>
                  {/* Input */}
                  <div className="w-full flex flex-col mb-0">
                    {/* <div className="mb-4 text-lg text-slate-300 font-semibold0">Search printer by barcode:</div> */}
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
                                
                                <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0 bg-dark-400 border-0 border-slate-300">
                                  <SelectValue placeholder="Tech's name" />
                                </SelectTrigger>

                                <SelectContent id="mySelect" className="bg-dark-400 p-0 text-white border-0">
                                  <SelectGroup className="py-4" >
                                    {/* <SelectLabel className='text-lg font-bold border-b border-white'>Techs:</SelectLabel> */}
                                    {
                                      users.map((user: { name: string; nickname: string })=>(
                                        <SelectItem key={user.name} value={user.name} className='py-2 hover:bg-dark-200'>{user.nickname}</SelectItem>    
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
                  </div>
                </div>
              </form>
            </Form>
        </>
      }
    </>

  )
}