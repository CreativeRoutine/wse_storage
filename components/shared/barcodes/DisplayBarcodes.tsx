"use client";
import React from "react";
import Barcode from "react-barcode";

interface Props {
  type: string;
  start: string;
  finish: number;
}

const DisplayBarcodes = ({ type, start, finish }: Props) => {
  let barcodes: string[] = [];

  if (type === "WSE-W") {
    // Генерация для WSE-W
    const [warehouse, location] = start.split("-"); // Теперь это строка
    const warehouseNum = parseInt(warehouse); // Пример: W1 -> 1
    const row = location[0]; // Пример: A
    const number = parseInt(location.slice(1)); // Пример: 1

    barcodes = Array.from(
      { length: finish },
      (_, index) => `W${warehouseNum}-${row}${number + index}`
    );
  } else {
    // Генерация стандартных числовых баркодов
    barcodes = Array.from(
      { length: finish - parseInt(start) + 1 },
      (_, index) => `${type}-${parseInt(start) + index}`
    );
  }

  return (
    <div className="print:block">
      {barcodes.map((barcode, index) => (
        <div key={index} className="mb-4 print:block print:w-[160px]">
          <Barcode value={barcode} />
        </div>
      ))}
    </div>
  );
};

export default DisplayBarcodes;