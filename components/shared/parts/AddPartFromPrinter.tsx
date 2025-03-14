"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

import {
  addPartFromPrinter,
  getListOfAllPrinters,
  getPartsByName,
  getPartsByProductNumberPlain,
} from "@/lib/actions/parts.action";
import { addPartFromPrinterSchema } from "@/lib/validations";

interface Props {
  printerId: string;
  printerProductNumber: string;
}

interface FormData {
  printers: string;
  part: string;
}

export default function AddPart({ printerId, printerProductNumber }: Props) {
  const { toast } = useToast();
  const [partsData, setPartsData] = useState<any[]>([]); // Список деталей
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof addPartFromPrinterSchema>>({
    resolver: zodResolver(addPartFromPrinterSchema),
    defaultValues: {
      printers: "",
      part: "",
    },
  });

  // MY NEW LOGIC STARTS HERE

  const [initialPrintersList, setInitialPrintersList] = useState<string[]>([]);
  const [printerName, setPrinterName] = useState<string>("");
  const [initialPartsList, setInitialPartsList] = useState<string[]>([]);
  const [partName, setPartName] = useState<string>("");

  // 1. Запускаем поиск всех принтеров
  useEffect(() => {
    getPrinterData(); // This function receive all parts names to display them and to choose from
  }, []);

  //2. Получаем список всех принтеров
  async function getPrinterData() {
    try {
      const response: any = await getListOfAllPrinters();
      const printers = JSON.parse(JSON.stringify(response));
      setInitialPrintersList(printers);
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  //3. Когда выбираем конкретный принтер - стейт  printerName меняется
  const handlePrinterChange = (value: string) => {
    setPrinterName(value); // Устанавливаем выбранное значение
    form.setValue("printers", value); // Устанавливаем значение в форму
    console.log("Printer was choosed ==> ", value);
  };

  // 4. Когда 1е поле изменяется и есть конкретный принтер - получаем список всех деталей этого принтера
  useEffect(() => {
    getPartsData(); // This function receive all parts names to display them and to choose from
  }, [printerName]);

  // 5. Получаем список всех деталей конкретного принтер
  async function getPartsData() {
    try {
      const response: any = await getPartsByName({
        currentPrinter: printerName,
      });

      const parts = JSON.parse(JSON.stringify(response));

      console.log("PARTS", response);

      setInitialPartsList(parts);
    } catch (error) {
      console.error("Error fetching parts data:", error);
    }
  }

  const handlePartChange = (value: string) => {
    setPartName(value); // Устанавливаем выбранное значение
    form.setValue("part", value); // Устанавливаем значение в форму
    console.log("VALUE", value);
  };

  async function onSubmit(values: z.infer<typeof addPartFromPrinterSchema>) {
    console.log("STARTED SUBMITTING");
    setIsSubmitting(true);

    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5);

    try {
      const response: any = await addPartFromPrinter({
        createdOn,
        printer: values.printers,
        part: values.part,
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
        // setPartsData((prevParts) => prevParts.filter((part) => part.partsName !== values.partName));

        setInitialPartsList([]);
        setPrinterName("");
        form.reset({});
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
    // <div className="border-b border-slate-400 my-4">
    <div className="border-b border-slate-400 my-4 pb-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full mx-auto"
        >
          {/* Select Part Name */}
          {initialPrintersList.length > 0 && (
            <FormField
              control={form.control}
              name="printers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base text-slate-300 text-md font-semibold mb-2">
                    Part to be disassembled / Снять часть:
                  </FormLabel>

                  <FormControl>
                    <Select
                      onValueChange={handlePrinterChange}
                      // onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                        <SelectValue placeholder="Select Part Name" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-400 p-0 text-white border-0">
                        <SelectGroup className="py-4">
                          {initialPrintersList.map(
                            (part: any, index: number) => (
                              <SelectItem
                                key={index}
                                value={part}
                                className="py-2 text-white hover:bg-dark-200"
                              >
                                {part}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {initialPartsList.length > 0 && (
            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                // First Input
                <FormItem>
                  <FormLabel className="block font-semibold w-2/3 mb-4text-slate-300">
                    Parts
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-between gap-2 items-center ">
                      <Select
                        onValueChange={handlePartChange}
                        // value={partName || ""}
                        // defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                          <SelectValue
                            placeholder="Parts"
                            className="hello w-ful"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 p-0 text-white border-0 w-full">
                          <SelectGroup className="py-4 w-full">
                            {
                              //  listOfParts ? "Loading..." : "Select printer first"
                              initialPartsList.map((option: any) => (
                                <SelectItem
                                  key={option.partsName}
                                  value={option.partsName}
                                  className="py-2 text-white hover:bg-dark-200"
                                >
                                  <div className="flex flex-row justify-around gap-4">
                                    <div className="font-semibold">
                                      {option.partsName}
                                    </div>{" "}
                                    -{" "}
                                    <div>
                                      {option.part.length} / {option.maxParts}
                                    </div>
                                    {/* {" "} */}
                                    {/* /{" "} */}
                                    {/* <div>
                                      {option.part[0]?.location ||
                                        "No location"}
                                    </div> */}
                                  </div>
                                </SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
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
    // </div>
  );
}
