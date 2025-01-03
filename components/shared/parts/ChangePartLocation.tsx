"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { changePartLocationSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";

import { changePartLocation } from "@/lib/actions/parts.action";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";



export default function ChangePartLocation({printer, partName, id }: any) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();


  const form = useForm<z.infer<typeof changePartLocationSchema>>({
    resolver: zodResolver(changePartLocationSchema),
    defaultValues: {
      location: "",
      barcode:"",
    },
  });



  async function onSubmit(values: z.infer<typeof changePartLocationSchema>) {
    setIsSubmitting(true);

    console.log("FORM SUBMIT NAZHAT", );

    try {
      const response: any = await changePartLocation({
        printer: printer,
        id: id,
        partName: partName,
        location: values.location,
        barcode: values.barcode,
      });

      setIsSubmitting(false);
      form.reset();
      router.refresh();
      // router.push(`/addpart`)

      toast({
        title: response.message,
        variant: response.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
    }
  }

  return (
    <div className="bg-secondary-200  mb-1 w-full  rounded-xl border border-dark-350">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

          {/* Barcode */}
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full bg-dark-600 text-white border-0 focus:outline-none focus:ring-0 focus:shadow-none" placeholder="Barcode" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-slate-300 font-semibold">Location:</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full bg-dark-600 text-white border-0 focus:outline-none focus:ring-0 focus:shadow-none" placeholder="Location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}