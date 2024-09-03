"use client";
import React, { useState, useEffect } from 'react';

interface Props {
  onSelect: (updatedTests: string[]) => void;
  reset: boolean;
  onResetComplete: () => void;
}

export default function ChangedParts({ onSelect, reset, onResetComplete }: Props) {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleSelect = (test: string) => {
    const updatedTests = selectedTests.includes(test)
      ? selectedTests.filter(t => t !== test)
      : [...selectedTests, test];
    
    setSelectedTests(updatedTests);
    onSelect(updatedTests);
  };

  useEffect(() => {
    if (reset) {
      setSelectedTests([]); // Сбрасываем выбор
      onSelect([]); // Передаем пустой массив в родительский компонент
      onResetComplete(); // Сообщаем родителю, что сброс завершен
    }
  }, [reset, onSelect, onResetComplete]);

  return (
    <div className="my-2">
      <div className="mb-4 flex flex-row items-start space-y-0">
        <label className="text-base text-slate-300 font-semibold">Tested and performed</label>
        <div className="flex flex-wrap justify-end gap-2">
            {["USB", "Scanner", "Network", "Cold Reset", "NVRam reset", "Maintenance Kit"].map(test => (
              <button
                key={test}
                onClick={() => handleSelect(test)}
                className={`py-2 px-4 rounded ${selectedTests.includes(test) ? 'bg-primary-500 text-white' : 'bg-dark-600 text-white'}`}
              >
                {test}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
