"use client";
import { updatePartCategoryLimit } from "@/lib/actions/parts.action";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast"

interface MaxPartsInputProps {
  initialLimit: number;
  printerPN: string;
  label: string;
}

export default function MaxPartsInput({ initialLimit, printerPN, label }: MaxPartsInputProps) {
  const { toast } = useToast();
  const [limit, setLimit] = useState<number>(initialLimit);

  // Функция для отправки запроса на сервер для обновления лимита
  const handleLimitChange = async (newLimit: number) => {
    try {
      const response = await updatePartCategoryLimit(printerPN, label, newLimit);
      if (response) {
        response.success ? toast({
          title: response.message,
          variant: 'default',
        }) : toast({
          title: response.message,
          variant: 'custom',
        })
      }
    } catch (error) {
      console.error("An error occurred while updating max parts limit:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLimit(newValue);
    handleLimitChange(newValue); // Обновляем лимит при изменении значения
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        value={limit}
        onChange={handleChange}
        className="w-16 bg-dark-600 text-white rounded px-2 py-1 text-right border-0 focus:outline-none"
        placeholder="Max"
      />
    </div>
  );
}