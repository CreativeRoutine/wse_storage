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

import { changeUserSupervisor } from '@/lib/actions/user.action';
import { ChangeUserSupervisorSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';

const type:any = 'create';

interface Props {
    mongoUserId: string;
}

export default function ChangeUserSupervisorForm ({mongoUserId}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // ChangeUserDepartmentChangeUserSupervisorSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof ChangeUserSupervisorSchema>>({
    resolver: zodResolver(ChangeUserSupervisorSchema),
    defaultValues: {
        supervisor: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ChangeUserSupervisorSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new printer model
      await changeUserSupervisor({
        _id: JSON.parse(JSON.stringify(mongoUserId)), 
        supervisor: values.supervisor,
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
                    name="supervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is User a Supervisor?</FormLabel>
                          <div className="flex flex-row gap-2">

                            <Select onValueChange={value => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <FormControl className="no-focus">
                                <SelectTrigger className="no-focus">
                                  <SelectValue placeholder="Supervisor" />
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
                        {'Change Supervisor status'}
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