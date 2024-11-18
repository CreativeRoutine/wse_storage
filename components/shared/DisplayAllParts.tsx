"use server"

// import React from 'react'
import {formatTime} from "@/lib/utils";
// import Link from "next/link";
import { getPrinters } from "@/lib/actions/printer.action";

interface Props {
  parts: any;
  
}

const DisplayParts = async ({parts}:Props) => {

//   console.log("PARTS RECEIVED IN DP ===>",parts)
    
  if(parts.length == 0){
    return(<tr><td className="pt-6 text-white text-left">"You didn't add any part yet!"</td></tr>)
  }

  // Подсчет количества элементов с одинаковыми productNumber
//   const productCount = parts.reduce((acc:any, item:any) => {
//     acc[item.productNumber] = (acc[item.productNumber] || 0) + 1;
//     return acc;
//   }, {});

//   console.log('Количество элементов с одинаковыми productNumber:');
//   console.log(productCount); // { PN123456: 3, PN234567: 1 }

  // Подсчет уникальных комбинаций productNumber + partName
//   const uniqueProductParts = parts.reduce((acc:any, item:any) => {
//     const key = `${item.productNumber}_${item.partName}`;
//     acc.add(key);
//     return acc;
//   }, new Set());

//   console.log('Количество уникальных комбинаций productNumber + partName:');
//   console.log(uniqueProductParts.size); // Уникальное количество

  // Преобразование в объект для удобного просмотра
  // const uniqueCombinations = Array.from(uniqueProductParts).map((key: string): { productNumber: string; partName: string } => {
  //   const [productNumber = '', partName = ''] = key.split('_');
  //   return { productNumber, partName };
  // });

//   console.log('Уникальные комбинации productNumber + partName:');
  // console.log(uniqueCombinations);

  return (
    <>
      <ul className="list-disc ml-4">
        {parts.map((printer:any) =>
          printer.parts.length > 0 ? (
            printer.parts.map((part: any) =>
              part.part.length > 0 ? (
                part.part.map((item: any, index: number) => (
                  <li key={`${printer._id}-${part.partsName}-${index}`} className="mb-2">
                    <span className="font-bold">{printer.printerName}</span> -{" "}
                    <span className="text-gray-600">{printer.productNumber}</span>,{" "}
                    <span className="text-blue-500">{part.partsName}</span>:{" "}
                    <span className="text-green-600">{item.location || "No Location"}</span>
                  </li>
                ))
              ) : (
                <li key={`${printer._id}-${part.partsName}`}>
                  <span className="font-bold">{printer.printerName}</span> -{" "}
                  <span className="text-gray-600">{printer.productNumber}</span>,{" "}
                  <span className="text-blue-500">{part.partsName}</span>:{" "}
                  <span className="text-red-500">No Parts Available</span>
                </li>
              )
            )
          ) : (
            // test
            <li key={printer._id}>
              <span className="font-bold">{printer.printerName}</span> -{" "}
              <span className="text-gray-600">{printer.productNumber}</span>:{" "}
              <span className="text-red-500">No Parts Available</span>
            </li>

          )
        )}
      </ul>





    </>
  )
}

export default DisplayParts