"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  label: string; // Метка (название поля)
  options: string[]; // Список опций
  onSelect: (value: string) => void; // Колбэк для выбора
  reset: boolean; // Указывает, нужно ли сбросить поле
  onResetComplete?: () => void; // Колбэк после сброса
}

const OptionSelector: React.FC<Props> = ({
  label,
  options,
  onSelect,
  reset,
  onResetComplete,
}) => {
  const [isChanged, setIsChanged] = useState(false); // Индикатор изменения
  const [selectedValue, setSelectedValue] = useState<string | null>(null); // Выбранное значение

  // Сбрасываем состояние при reset
  useEffect(() => {
    if (reset) {
      setIsChanged(false);
      setSelectedValue(null); // Сбрасываем выбранное значение
      if (onResetComplete) {
        onResetComplete();
      }
    }
  }, [reset, onResetComplete]);
  

  // Обработчик выбора опции
  const handleChange = (value: string) => {
    setSelectedValue(value); // Устанавливаем выбранное значение
    setIsChanged(true); // Помечаем как изменённое
    onSelect(value); // Передаём наверх
  };

  return (
    <div className="my-3 flex flex-row items-center space-y-0">
      {/* Метка с динамическим классом */}
      <label
        className={`block font-semibold w-2/3 ${
          isChanged ? "text-green-500" : "text-slate-300"
        }`}
      >
        {label}
      </label>
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-dark-600 border-0 text-white focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-dark-400 p-0 text-white border-0">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="py-2 hover:bg-dark-200"
              >
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OptionSelector;
