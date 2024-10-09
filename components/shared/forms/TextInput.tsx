"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  onInput: (value: string) => void;
  reset: boolean;
  onResetComplete: () => void;
}

export default function AdditionalInfo({ onInput, reset, onResetComplete }: Props) {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (reset) {
      setInputValue(""); // Сброс значения ввода
      onInput(""); // Передаем пустую строку как значение по умолчанию
      onResetComplete(); // Сообщаем родителю, что сброс завершен
    }
  }, [reset, onInput, onResetComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInput(e.target.value); // Передаем введенное значение
  };

  return (
    <div className="my-2">
      <div className="flex flex-row items-start space-y-0">
        <label className="w-2/3 text-base text-slate-300 font-semibold">Additional Information</label>
        <input
          type="text"
          value={inputValue}
          className="w-full bg-dark-600 text-white rounded p-2 pr-6 flex flex-wrap justify-end gap-2 text-right border-0 focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0"
          onChange={handleChange}
          placeholder="Enter additional information"
        />
      </div>
    </div>
  );
}
