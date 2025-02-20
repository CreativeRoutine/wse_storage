"use client";
import React, {useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { renamePartInListSchema } from "@/lib/validations";
import {useRouter, usePathname} from 'next/navigation';
import {  renamePartInList } from '@/lib/actions/partsList.action';

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
import { useToast } from "@/components/ui/use-toast"

const type:any = 'create';

interface Props {
    oldPartName: string;
}

export default function RenamePartInList ({ oldPartName }: Props){
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();


  // 1. Define your form.
  // renamePartInListSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof renamePartInListSchema>>({
    resolver: zodResolver(renamePartInListSchema),
    defaultValues: {
      oldName: oldPartName || "",
      newName: "",
    },
  });

  // 2. Define a submit handler.
  // renamePartInListSchema took from lib/validations.ts to validate the form


  // console.log("Ошибки валидации формы:", form.formState.errors);
  async function onSubmit(values: z.infer<typeof renamePartInListSchema>) {
    // console.log("ON SUBMIT")
    setIsSubmitting(true);

    try {
      // this function took from lib/actions/partsList.action.ts to rename a part in the list
      const response = await renamePartInList({
        oldName: oldPartName,
        newName: values.newName,
        path: usepathname,
      })
      
      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      // router.push("/settings/parts")
      form.reset({}); // Reset form fields
      router.refresh()

      // return (
        response.success ? toast({
          title: response.message,
          variant: 'default',
        }) : toast({
          title: response.message,
          // description: response.info,
          variant: 'custom',
        })
      // )
      
      
    } catch (error) {
      console.error("THIS IS AN ERROR", error); 
    }
  }


  return (
    <div className="bg-transparent px-0 mb-2 py-2 w-full rounded-xl  border-0 shadow-lg">

      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>    
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">

            <div className='flex gap-4 mb-4'>
              <div className="w-full">
                {/* Make - Product Number */}
                <FormField
                  control={form.control}
                  name="newName"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">Corrected name:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="New part name"
                            {...field}
                          />
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>




            <Button type="submit" className="bg-primary-500 text-white text-lg w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  {type === 'edit' ? 'Editing ...' : 'Renaming ...'}
                </>
              ) : (
                <>
                {type === 'edit' ? 'Edit pallet' : 'Rename part'}
                </>
              )}
            </Button>
          </form>
        </Form>

      </div>


    </div>
  )
}