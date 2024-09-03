"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSearchSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import { createPrinter } from '@/lib/actions/printer.action';
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

interface Props {
  users: any;
  setSelectedUser: any;
}

export default function SelectTech ({ users, setSelectedUser }: Props){
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // userSearchSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof userSearchSchema>>({
    resolver: zodResolver(userSearchSchema),
    defaultValues: {
      userName: "",
    },
  });

  // 2. Define a submit handler.
  // userSearchSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof userSearchSchema>) {
    setIsSubmitting(true);


    const createdOn = moment().tz("America/Chicago").toDate();

    createdOn.setHours(createdOn.getHours() - 5); 

    try {
      // this function took from lib/actions/pallet.action.ts to create a new printer model
      const response = "response" //await createPrinter({
      
        
        setSelectedUser({id: "12345678", name: values.userName})


        setIsSubmitting(false); // Reset isSubmitting state
        // defined as a hook
        // form.reset({}); // Reset form fields

        response ? ( toast({
          title: "User successfully set!",
          variant: 'default',
        })) :(
          toast({
            title: "User was not found in DataBase!",
            description: "Something gone wrong!.",
            variant: 'custom',
          })
        )
      
      
    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
    }
  }

  return (
    <> 
      {/* ======================================================================= */}
      <Form {...form}>    
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

          <div className='flex gap-6'>
            <div className="w-full">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  // First Input
                  <FormItem className="mt-2">
                    {/* <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Tech's name:</FormLabel> */}
                    <FormControl>
                      <div className="flex">
                      <Select
                          onValueChange={(value) => {
                              field.onChange(value); // Update the form field value
                              form.handleSubmit(onSubmit)(); // Submit the form
                          }}
                          >
                          
                          <SelectTrigger className="w-full focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0 bg-dark-600 border-0 border-slate-300">
                              <SelectValue placeholder="Tech's name" />
                          </SelectTrigger>

                          <SelectContent id="mySelect" className="bg-dark-400 p-0 text-white border-0">
                              <SelectGroup className="py-4" >
                              {/* <SelectLabel className='text-lg font-bold border-b border-white'>Techs:</SelectLabel> */}
                              {
                                  users.map((user: { name: string; id: string })=>(
                                  <SelectItem key={user.id} value={user.name} className='py-2 text-white hover:bg-dark-200'>{user.name}</SelectItem>    
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




            {/* <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'edit' ? 'Editing ...' : 'Adding ...'}
                </>
              ) : (
                <>
                {type === 'edit' ? 'Edit pallet' : 'Add printer'}
                </>
              )}
            </Button> */}
        </form>
      </Form>
    </>
  )
}