"use client";

import React, { useState } from 'react';
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
import { deleteSupplierSchema } from '@/lib/validations';
import { useRouter, usePathname } from 'next/navigation';
import { deleteSupplier } from '@/lib/actions/supplier.action';
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

export default function DeleteSupplier({ id }: Props) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const form = useForm<z.infer<typeof deleteSupplierSchema>>({
    resolver: zodResolver(deleteSupplierSchema),
    defaultValues: {
        _id: "",
    },
  });
 
  async function onSubmit() {
    setIsSubmitting(true);
  
    try {
      const response:any = await deleteSupplier({
        _id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      });
      
      form.reset();
      setIsSubmitting(false);

      response ? ( router.push(`/settings/suppliers`) ) : (null);

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
        <AlertDialogTrigger className="w-full bg-red-500 text-white font-semibold mt-3 py-3 rounded-lg hover:bg-red-600">Delete supplier!</AlertDialogTrigger>
        <AlertDialogContent className="bg-white">

          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure you want to delete it?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Supplier
               and remove your data from database.
            </AlertDialogDescription>
          </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-red-600 border-red-600">I made mistake!</AlertDialogCancel>
          <AlertDialogAction className="hover:text-red-600" type="submit" onClick={onSubmit} >Delete anyway!</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">
          <Button type="submit" onClick={onSubmit} className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
            {isSubmitting ? 'Deleting ...' : 'Delete Supplier'}
          </Button>
        </form>
      </Form> */}
      
    </>
  );
}