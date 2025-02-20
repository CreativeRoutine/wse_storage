"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";

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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { addPartFromPrinter, getPartsByProductNumberPlain } from "@/lib/actions/parts.action";

interface Props {
  printerId: string;
  printerProductNumber: string;
}

interface FormData {
  partName: string;
  productNumber: string;
}

export default function AddPart({ printerId, printerProductNumber }: Props) {
  const { toast } = useToast();
  const [partsData, setPartsData] = useState<any[]>([]); // Список деталей
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    defaultValues: {
      partName: "",
      productNumber: printerProductNumber || "",
    },
  });

  useEffect(() => {
    if (printerProductNumber) {
      getPrinterData();
    }
  }, [printerProductNumber]);

  async function getPrinterData() {
    try {
      const response: any = await getPartsByProductNumberPlain({
        productNumber: printerProductNumber,
      });

      const parts = JSON.parse(JSON.stringify(response));
      setPartsData(parts.parts || []); // Сохраняем детали
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);

    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);

    try {
      const response: any = await addPartFromPrinter({
        createdOn,
        partName: values.partName,
        productNumber: printerProductNumber,
        printerId, // Опционально
        used: false,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
          variant: "default",
        });

        // Удаляем добавленную деталь из списка partsData
        setPartsData((prevParts) => prevParts.filter((part) => part.partsName !== values.partName));

        form.reset({ partName: "" });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding part:", error);
      toast({
        title: "Submission failed",
        description: "An error occurred while submitting the form.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-b border-slate-400 my-4">
      <div className="bg-secondary-200 mb-1 py-6 w-full lg:w-1/2 rounded-xl border border-dark-350">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
            {/* Select Part Name */}
            {partsData.length > 0 && (
              <FormField
                control={form.control}
                name="partName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-slate-300 text-md font-semibold mb-2">
                      Part to be disassembled:
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger className="w-full focus:outline-none bg-dark-600 border-0 text-white">
                          <SelectValue placeholder="Select Part Name" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 p-0 text-white border-0">
                          <SelectGroup className="py-4">
                            {partsData.map((part: any, index: number) => (
                              <SelectItem
                                key={index}
                                value={part.partsName}
                                className="py-2 text-white hover:bg-dark-200"
                              >
                                {part.partsName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="bg-primary-500 text-white text-lg w-full p-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Remove part"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}