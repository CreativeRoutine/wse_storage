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

import { changeUserAdmin } from '@/lib/actions/user.action';
import { ChangeUserAdminSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';

const type:any = 'create';

interface Props {
    mongoUserId: string;
}

export default function ChangeUserAdminForm ({mongoUserId}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // ChangeUserDepartmentChangeUserAdminSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof ChangeUserAdminSchema>>({
    resolver: zodResolver(ChangeUserAdminSchema),
    defaultValues: {
      admin: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ChangeUserAdminSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      await changeUserAdmin({
        _id: JSON.parse(JSON.stringify(mongoUserId)), 
        admin: values.admin,
        path: usepathname,
      })

      form.reset({}); // Reset form fields
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/settings/users/${mongoUserId}`)

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
                    name="admin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is User an Admin?</FormLabel>
                          <div className="flex flex-row gap-2">

                            <Select onValueChange={value => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <FormControl className="no-focus">
                                <SelectTrigger className="no-focus">
                                  <SelectValue placeholder="Admin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='bg-white no-focus'>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>

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
                        {'Change Admin status'}
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