"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { searchForPartSchema } from "@/lib/validations";
import { deletePrinterPartFromStorage, getListOfAllPrinters, getPartsByName } from "@/lib/actions/parts.action";
import { useToast } from "@/components/ui/use-toast"
import {useRouter} from 'next/navigation';

interface Props {
  label: string;
  onSelect: (selectedParts: string[]) => void;
  reset: boolean;
  onResetComplete?: () => void;
}

export default function PartsChanged({
  label,
  onSelect,
  reset,
  onResetComplete,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialPrintersList, setInitialPrintersList] = useState<string[]>([]);
  const [listOfParts, setListOfParts] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState(false);
  const [selectedParts, setSelectedParts] = useState<string[]>([]); // Добавляем массив выбранных деталей
  
  // NEW LOGIC OF STATES
  const [printerName, setPrinterName] = useState<string | null>(null);
  const [partName, setPartName] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);

  const form = useForm<z.infer<typeof searchForPartSchema>>({
    resolver: zodResolver(searchForPartSchema),
    defaultValues: {
      name: "",
      parts: "",
      barcode: "",
    },
  });

  useEffect(() => {
    getPrinterData();
  }, []);
  
  async function getPrinterData() {
    try {
      const response: any = await getListOfAllPrinters();
      const printers = JSON.parse(JSON.stringify(response));
      setInitialPrintersList(printers);
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  const handleChange = (value: string) => {
    setPrinterName(value);
    form.setValue("name", value);
  };

  useEffect(() => {
    if (printerName) {
      findParts();
    }
  }, [printerName]);

  async function findParts() {
    try {
      const response: any = await getPartsByName({currentPrinter: printerName });
      const parts = JSON.parse(JSON.stringify(response));
      setListOfParts(parts);
    } catch (error) {
      console.error("Error fetching printer data:", error);
    }
  }

  // Добавляем обработчик выбора детали
  const handlePartChange = (value: string) => {
    setPartName(value);
    form.setValue("parts", value, { shouldValidate: true });
    
    // Обновляем массив выбранных деталей
    const updatedParts = selectedParts.includes(value)
      ? selectedParts.filter((p) => p !== value)
      : [...selectedParts, value];
    
    setSelectedParts(updatedParts);
    // onSelect(updatedParts); // Передаем выбранные детали в родительскую функцию
    setSelectedValue(updatedParts.length > 0); // Обновляем состояние выбора
  };

  async function onSubmit(values: z.infer<typeof searchForPartSchema>) {
    setIsSubmitting(true);
  
    try {
      const response = await deletePrinterPartFromStorage({
        name: values.name,
        parts: values.parts,
        barcode: values.barcode,
      });
  
      if (response.success) {
        toast({
          title: "Part replaced successfully!",
          variant: "default",
        });

        onSelect([values.parts]); // Передаем пустой массив в родительскую функцию
  
        form.reset({});
        setPrinterName(null);
        setPartName(null);
        setBarcode(null);

        setListOfParts([]);
        setSelectedParts([]); // Очищаем выбранные детали
        setSelectedValue(false);
        setIsSubmitting(false);
      } else {
        toast({
          title: "Error replacing part!",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("THIS IS AN ERROR", error);
      setIsSubmitting(false);
      toast({
        title: "Unexpected Error",
        description: "An error occurred while replacing the part. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Добавляем обработку сброса
  useEffect(() => {
    if (reset) {
      setSelectedValue(false);
      setSelectedParts([]);
      form.reset({ name: "", parts: "", barcode: "" });
      setPrinterName(null);
      setPartName(null);
      setBarcode(null);
      setListOfParts([]);
      onSelect([]); // Передаем пустой массив в родительскую функцию
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, form, onResetComplete]);

  return (
    <>
      <div className="w-full mb-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full mx-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`block font-semibold w-2/3 mb-4 ${
                    selectedValue ? "text-green-500" : "text-slate-300"
                  }`}>
                    {label}
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-between gap-2 items-center">
                      <Select
                        onValueChange={handleChange}
                        value={printerName || ""}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                          <SelectValue placeholder="Printer" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-400 p-0 text-white border-0">
                          <SelectGroup className="py-4">
                            {initialPrintersList.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="py-2 text-white hover:bg-dark-200"
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {listOfParts.length > 0 && (
              <FormField
                control={form.control}
                name="parts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-semibold w-2/3 mb-4 text-slate-300">Parts</FormLabel>
                    <FormControl>
                      <div className="flex justify-between gap-2 items-center">
                        <Select
                          onValueChange={handlePartChange}
                          value={partName || ""}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full border-0 bg-dark-600 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
                            <SelectValue placeholder="Parts" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-400 p-0 text-white border-0 w-full">
                            <SelectGroup className="py-4 w-full">
                              {listOfParts.map((option: any) => (
                                <SelectItem
                                  key={option.partsName}
                                  value={option.partsName}
                                  className="py-2 text-white hover:bg-dark-200"
                                >
                                  <div className="flex flex-row justify-around gap-4">
                                    <div>{option.partsName}</div> / 
                                    <div>{option.part.length} / {option.maxParts}</div> / 
                                    <div>{option.part[0]?.location || "No location"}</div>
                                  </div>
                                </SelectItem>
                              ))}
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

            {partName && (
              <>
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-3 text-base text-slate-300 font-semibold">Barcode:</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            className="w-full mb-4 outline-none bg-dark-600 text-white border-0 rounded-lg no-focus"
                            placeholder="Barcode"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="bg-primary-500 text-white text-lg mt-6 w-full p-6" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Replacing ...' : 'Replace part'}
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}