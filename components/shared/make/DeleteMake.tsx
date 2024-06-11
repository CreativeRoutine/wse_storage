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
import { deleteMakeSchema } from '@/lib/validations';
import { useRouter, usePathname } from 'next/navigation';
import { deleteMake } from '@/lib/actions/makes.action';

const type:any = 'create';

interface Props {
  id: string;
}

export default function DeleteMake({ id }: Props) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const form = useForm<z.infer<typeof deleteMakeSchema>>({
    resolver: zodResolver(deleteMakeSchema),
    defaultValues: {
        _id: "",
    },
  });

  async function onSubmit() {
    setIsSubmitting(true);
  
    try {
      await deleteMake({
        _id: JSON.parse(JSON.stringify(id)),
        path: usepathname,
      });
      
      form.reset();
      setIsSubmitting(false);
      router.push(`/settings/makes`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="ml-auto">
          <Button type="submit" onClick={onSubmit} className="w-full bg-red-500 text-white mt-3" disabled={isSubmitting}>
            {isSubmitting ? 'Deleting ...' : 'Delete Make'}
          </Button>
        </form>
      </Form>
      
    </>
  );
}