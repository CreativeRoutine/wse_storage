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
      const response = await deleteSupplier({
        _id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      });
      
      form.reset();
      setIsSubmitting(false);
      
      response ? (
        toast({ title: "Supplier deleted successfully!", variant: 'default'})
      ):(
        toast({
          title: "Supplier can't be deleted!",
          description: "Check if the supplier is not linked to any printer or pallet",
          variant: 'custom',
        })
      )
      
      response ? ( router.push(`/settings/suppliers`) ) : (null);



    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">
          <Button type="submit" onClick={onSubmit} className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
            {isSubmitting ? 'Deleting ...' : 'Delete Supplier'}
          </Button>
        </form>
      </Form>
      
    </>
  );
}