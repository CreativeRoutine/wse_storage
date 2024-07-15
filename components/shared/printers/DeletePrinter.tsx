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
import { deletePrinterSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { deletePrinter } from '@/lib/actions/printer.action';
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


const type:any = 'create';
interface Props {
  id: string;
  mongoUserId: string;
}

export default  function DeletePrinter ({id}:Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // deletePrinterSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePrinterSchema>>({
    resolver: zodResolver(deletePrinterSchema),
    defaultValues: {
      id: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsSubmitting(true);
    // const numericPrice = parseFloat(values.price); // Convert price to a number
    try {

      // this function took from lib/actions/printer.action.ts to create a new printer model
      const response = await deletePrinter({
        id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/printers`)

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


  // const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));


  const [open, setOpen] = React.useState(false);


  return (
    <>
      {/* New Form with Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="w-full bg-red-500 text-white font-semibold mt-3 py-3 rounded-lg hover:bg-red-600">Delete printer</AlertDialogTrigger>
        <AlertDialogContent className="bg-white">

          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure you want to delete it?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete printer
               and remove your data from database.
            </AlertDialogDescription>
          </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-red-600 border-red-600">I made mistake!</AlertDialogCancel>
          <AlertDialogAction className="hover:text-red-600" type="submit" onClick={onSubmit} >Delete anyway!</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


          {/* Old form  */}
          {/* {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">

                  
                  <Button type="submit" onClick={onSubmit}  className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Deleting ...'}
                        </>
                      ) : (
                        <>
                        {'Delete printer'}
                        </>
                      )}
                  </Button>
                </form>
              </Form>
            </>
          } */}

    </>

  )
}