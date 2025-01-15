"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateBarcodeSchema } from "@/lib/validations";
import { useRouter, usePathname } from "next/navigation";
import { generateBarcode, generateStorageBarcode } from "@/lib/actions/barcodes.action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SubmitType: any = "create";

interface Props {
  barcodes: any;
  setTempBarcodes: any;
}

export default function CreateStorageBarcodes({ barcodes, setTempBarcodes }: Props) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barcodeType, setBarcodeType] = useState("WSE-W1");
  const router = useRouter();
  const usepathname = usePathname();

  function handleUserSelect(type: string) {
    setBarcodeType(type);
  }

  const form = useForm<z.infer<typeof generateBarcodeSchema>>({
    resolver: zodResolver(generateBarcodeSchema),
    defaultValues: {
      type: barcodeType,
      start: "",
      finish: "",
    },
  });

  async function onSubmit(values: z.infer<typeof generateBarcodeSchema>) {
    setIsSubmitting(true);

    try {
      // Проверяем формат ввода
      const isValidStart = /^[A-Z][0-9]+$/.test(values.start);
      const isValidFinish = /^[A-Z][0-9]+$/.test(values.finish);

      if (!isValidStart || !isValidFinish) {
        toast({
          title: "Invalid format",
          description: "Start and finish must be in format 'A1', 'B2', etc.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await generateStorageBarcode({
        type: barcodeType,
        start: values.start,
        finish: values.finish,
        path: usepathname,
      });

      setIsSubmitting(false);

      if (response.success) {
        setTempBarcodes({ type: barcodeType, start: values.start, finish: values.finish });

        toast({
          title: response.message,
          variant: "default",
        });
      } else {
        toast({
          title: response.message,
          variant: "custom",
        });
      }
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
      setIsSubmitting(false);
      toast({
        title: "Unexpected Error",
        description: "An error occurred while generating the barcode. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="bg-secondary-200 w-full mt-8">
      <div className="mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
            <div className="flex gap-6">
              <div className="w-full">
                <div className="mb-4 text-lg text-slate-300 font-semibold">Create Storage barcode:</div>

                <div className="flex flex-row gap-2">
                  {/* Select field for barcode type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode type:</FormLabel>
                        <div className="flex">
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleUserSelect(value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full border-0 bg-dark-600">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-400 text-white border-0">
                              <SelectGroup className="py-4">
                                <SelectItem value="WSE-W1" className="py-2 text-white hover:bg-dark-200">
                                  WSE-W1
                                </SelectItem>
                                <SelectItem value="WSE-W2" className="py-2 text-white hover:bg-dark-200">
                                  WSE-W2
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start input */}
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Start barcode:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="w-full mb-4 bg-dark-600 text-white border-0 rounded-lg"
                            placeholder="A1, B2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Finish input */}
                  <FormField
                    control={form.control}
                    name="finish"
                    render={({ field }) => (
                      <FormItem className="mt-2 w-1/3">
                        <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Finish barcode:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="w-full mb-4 bg-dark-600 text-white border-0 rounded-lg"
                            placeholder="A3, B5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="bg-primary-500 text-white text-lg mt-6 w-full p-6" disabled={isSubmitting}>
              {isSubmitting ? "Generating ..." : "Generate storage barcodes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}