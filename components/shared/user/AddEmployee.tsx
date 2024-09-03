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
import { Input } from "@/components/ui/input";


import { Button } from "@/components/ui/button";

import { addEmployee } from '@/lib/actions/user.action';
import { AddEmployeeSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';

const type:any = 'create';

interface Props {
    mongoUserId: string;
}

export default function AddEmployeeForm ({mongoUserId}:Props){

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // ChangeUserDepartmentAddEmployeeSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof AddEmployeeSchema>>({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: {
      name: "",
      lastName: "",
      nickName: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AddEmployeeSchema>,) {
    setIsSubmitting(true);
    
    try {
      
      // this function took from lib/actions/printer.action.ts to create a new employee
      await addEmployee({
        _id: JSON.parse(JSON.stringify(mongoUserId)), 
        name: values.name,
        lastName: values.lastName,
        nickName: values.nickName,
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-2">

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      // First Input
                      <FormItem>
                        <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Employee' Name:</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="w-full mb-1 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Name"
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
                    name="lastName"
                    render={({ field }) => (
                      // First Input
                      <FormItem>
                        <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Employee' last name:</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="w-full mb-1 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Last name"
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
                    name="nickName"
                    render={({ field }) => (
                      // First Input
                      <FormItem>
                        <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Employee' Nickname:</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              className="w-full mb-1 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                              placeholder="Nickname"
                              {...field}
                            />
                          </div>
                        </FormControl>

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