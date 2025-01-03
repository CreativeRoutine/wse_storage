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
import { deletePalletSchema } from '@/lib/validations';
import {useRouter, usePathname} from 'next/navigation';
import { deletePallet } from '@/lib/actions/pallet.action';
// import { updatePalet } from '@/lib/actions/pallet.action';
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
}

export default  function DeletePallet ({id}:Props){
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  // 1. Define your form.
  // deletePalletSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePalletSchema>>({
    resolver: zodResolver(deletePalletSchema),
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
      const response = await deletePallet({
        id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      })

      form.reset(); // Reset form fields
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      router.push(`/storage`)

      return toast({
        title: response ? "Pallet deleted successfully!" : "An error occurred while deleting the printer",
        variant: response ? 'default' : 'custom',
      })

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

  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* New Form with Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger className="w-[220px] bg-red-500 text-white font-semibold mt-3 py-2 rounded-lg hover:bg-red-600">Delete empty pallet</AlertDialogTrigger>
        <AlertDialogContent className="bg-white">

          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure you want to delete it?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete pallet
               and remove your data from database.
            </AlertDialogDescription>
          </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-red-600 border-red-600">I made mistake!</AlertDialogCancel>
          <AlertDialogAction className="hover:text-red-600" type="submit" onClick={onSubmit} >Delete anyway!</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

          {/* {
            <>
              <Form {...form}>  
                <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">

                  
                  <Button type="submit" onClick={onSubmit}  className="bg-red-500 text-white mt-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          {'Deleting ...'}
                        </>
                      ) : (
                        <>
                        {'Delete pallet'}
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