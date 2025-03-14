"use client";
import React from "react";
import Barcode from "react-barcode";

interface Props {
  type: string;
  start: string; // В формате "A1"
  finish: string; // Только число, например, "10"
}

const DisplayStorageBarcodes = ({ type, start, finish }: Props) => {
  if (!start || !finish || !type) {
    return <div className="text-red-500">No barcodes generated.</div>;
  }

  // Разбиваем начальное значение
  const startRow = start[0]; // Первая буква (ряд)
  const startShelf = parseInt(start.slice(1), 10); // Число из стартового значения
  const finishShelf = parseInt(finish, 10); // Конечное число (полка)

  // Проверяем корректность диапазона
  if (isNaN(startShelf) || isNaN(finishShelf) || finishShelf < startShelf) {
    return <div className="text-red-500">Invalid barcode range.</div>;
  }

  // Генерируем массив баркодов
  const barcodes = Array.from(
    { length: finishShelf - startShelf + 1 },
    (_, index) => `${type}-${startRow}${startShelf + index}`
  );

  // Render Barcodes
  return (
    <div>
      {barcodes.map((barcode, index) => (
        <div key={index} className="mb-4">
          <Barcode value={barcode} width={5} fontSize={12} />
        </div>
      ))}
    </div>
  );
};

export default DisplayStorageBarcodes;
