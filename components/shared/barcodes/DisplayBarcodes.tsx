"use client";
import React from "react";
import Barcode from "react-barcode";

interface Props {
  type: string;
  start: string | number;
  finish: string | number;
}

const DisplayBarcodes = ({ type, start, finish }: Props) => {
  const barcodes = Array.from({ length: Number(finish) - Number(start) + 1 }, (_, index) => `${type}-${Number(start) + index}`);
  return (
    <div>
      {barcodes.map((barcode, index) => (
        <Barcode key={index} value={barcode} />
      ))}
    </div>
  );
};

export default DisplayBarcodes;