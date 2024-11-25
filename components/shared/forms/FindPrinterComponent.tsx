"use client";

import React, { useState } from "react";
import FindPrinterForm from "./FindPrinterForm";
import { findPrinter } from "@/lib/actions/printer.action";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  setPrinterID: (printer: any) => void;
  label: string;
}

const FindPrinterComponent = ({ setPrinterID, label }: Props) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetForm, setResetForm] = useState(false); // Новое состояние для сброса формы

  const handleSearch = async (values: { barcode: string }) => {
    setIsSubmitting(true);
    setResetForm(false); // Убираем флаг сброса перед началом поиска
    try {
      const response = await findPrinter({ barcode: values.barcode });

      if (response.success) {
        toast({
          title: response.message,
          variant: "default",
        });
        setPrinterID(response.printer); // Передаем данные о принтере в TechsForm
      } else {
        toast({
          title: "Printer not found",
          description: "Check the serial number or barcode.",
          variant: "custom",
        });
        setPrinterID(null); // Передаем null, если принтер не найден
      }
    } catch (error) {
      console.error("Error finding printer:", error);
      toast({
        title: "An error occurred",
        description: "Unable to fetch printer details.",
        variant: "destructive",
      });
      setPrinterID(null); // Передаем null при ошибке
    } finally {
      setIsSubmitting(false);
      setResetForm(true); // Устанавливаем флаг сброса после завершения поиска
    }
  };

  return (
    <FindPrinterForm
      onSubmit={handleSearch}
      isSubmitting={isSubmitting}
      label={label}
      reset={resetForm} // Передаем флаг сброса
    />
  );
};

export default FindPrinterComponent;