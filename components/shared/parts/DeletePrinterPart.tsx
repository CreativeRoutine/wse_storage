"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deletePrinterPartSchema } from "@/lib/validations";
import { useRouter, usePathname } from "next/navigation";

import { deletePrinterPart } from "@/lib/actions/parts.action";

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
import { useToast } from "@/components/ui/use-toast";

const type: any = "create";

interface Props {
  id: string;
}

export default function DeletePrinterPart({ id }: Props) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const usepathname = usePathname();

  const [selectedOption, setSelectedOption] = useState(""); // Локальное состояние для выбора
  const schema = z.object({ option: z.string().nonempty() });

  // 1. Define your form.
  // deletePrinterPartSchema took from lib/validations.ts to validate the form
  const form = useForm<z.infer<typeof deletePrinterPartSchema>>({
    resolver: zodResolver(deletePrinterPartSchema),
    defaultValues: {
      printerName: "",
    },
  });

  // 2. Define a submit handler.
  // deletePrinterPartSchema took from lib/validations.ts to validate the form
  async function onSubmit(values: z.infer<typeof deletePrinterPartSchema>) {
    setIsSubmitting(true);

    try {
      const response: any = await deletePrinterPart({
        printerName: id,
      });

      setIsSubmitting(false); // Reset isSubmitting state
      // defined as a hook
      // form.reset({}); // Reset form fields
      router.push("/settings/printer-parts");
      //   router.refresh()

      return response.success
        ? toast({
            title: response.message,
            variant: "default",
          })
        : toast({
            title: response.message,
            description: response.info,
            variant: "custom",
          });
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
    }
  }

  return (
    <div className="bg-transparent px-0 mb-2 py-2 w-full rounded-xl">
      <div className="mb-4">
        {/* ======================================================================= */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full mx-auto"
          >
            <div className="flex gap-4 mb-0">
              <div className="w-full">
                {/* Make - Product Number */}
                <FormField
                  control={form.control}
                  name="printerName"
                  render={({ field }) => (
                    // First Input
                    <FormItem>
                      <FormLabel className="mb-1 text-base text-slate-300 font-semibold">
                        Parts model:
                      </FormLabel>
                      <FormDescription className="text-red-400">
                        This will delete current printer parts model and all
                        parts inside.{" "}
                      </FormDescription>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 ouline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder={id}
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

            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-400 text-white text-lg w-full p-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>{type === "edit" ? "Editing ..." : "Deleting ..."}</>
              ) : (
                <>{type === "edit" ? "Edit pallet" : "Delete parts section"}</>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
