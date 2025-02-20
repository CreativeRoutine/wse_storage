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
import { addPrinterCommentSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { addPrinterComment } from '@/lib/actions/printer.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
  id: string;
}

export default  function CommentPrinter ({ id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // addPrinterCommentSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof addPrinterCommentSchema>>({
    resolver: zodResolver(addPrinterCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addPrinterCommentSchema>,) {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number

    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response:any = await addPrinterComment({
        _id: id,
        comment: values.comment, 
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/printers/${id}`)

      return toast({
        title: response ? "Comment added successfully!" : "Comment didn't add!",
        variant: response ? 'default' : 'custom',
      })

    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <>

          {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className='flex flex-col w-full'>
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                          // First Input
                          <FormItem>
                            {/* <FormLabel>Comment</FormLabel> */}
                            <FormControl>
                                <textarea
                                  className="outline-none bg-dark-400 text-base text-slate-300 border-0 rounded-lg no-focus resize-none p-4 w-full"
                                  placeholder="Comment to Technician"
                                  rows={3} // Adjust the number of visible rows as needed
                                  {...field}
                                />
                                
                            </FormControl>

                            <FormMessage className='text-red-500 text-lg mb-4'/>
                          </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-primary-500 text-white w-full mt-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            {'Adding ...'}
                          </>
                        ) : (
                          <>
                          {'Post comment'}
                          </>
                        )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          }

    </>

  )
}