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
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "@/components/ui/button";

import { changeUserDepartment } from '@/lib/actions/user.action';
import { ChangeUserDepartmentSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';

const type:any = 'create';

interface Props {
    mongoUserId: string;
}

export default function ChangeUserDepartmentForm ({mongoUserId}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // ChangeUserDepartmentChangeUserDepartmentSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof ChangeUserDepartmentSchema>>({
    resolver: zodResolver(ChangeUserDepartmentSchema),
    defaultValues: {
      department: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ChangeUserDepartmentSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      await changeUserDepartment({
        _id: JSON.parse(JSON.stringify(mongoUserId)), 
        department: JSON.stringify(values.department),
        path: usepathname,
      })

      form.reset({}); // Reset form fields
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/users/${mongoUserId}`)

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>
      <div className="bg-secondary-200 px-8 py-6  rounded-xl border border-dark-350 shadow-lg">
        <div className="">
          <div className=" text-lg text-slate-300 font-semibold">

          {
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add / change department</FormLabel>
                          <div className="flex flex-row gap-2">

                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl className="no-focus">
                                <SelectTrigger className="no-focus">
                                  <SelectValue placeholder="Deparrment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='bg-white no-focus'>
                                <SelectItem value="tech">Tech</SelectItem>
                                <SelectItem value="cleaner">Cleaner</SelectItem>
                                <SelectItem value="warehouse">Warehouse</SelectItem>
                                <SelectItem value="visitor">Visitor</SelectItem>
                              </SelectContent>
                            </Select>
                            </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-primary-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Changing ...'}
                        </>
                      ) : (
                        <>
                        {'Change department'}
                        </>
                      )}
                    </Button>
                </form>
              </Form>
            </>
          }
          </div>
        </div>
      </div>
    </>

  )
}