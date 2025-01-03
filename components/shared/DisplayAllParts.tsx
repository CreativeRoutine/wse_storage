"use server"

// import React from 'react'
import {formatTime} from "@/lib/utils";
import Link from "next/link";
import { getPrinters } from "@/lib/actions/printer.action";
import { Progress } from "@/components/ui/progress"

interface Props {
  parts: any;
  
}

const DisplayParts = async ({parts}:Props) => {

  const calcPercent = (val1:any, val2:any) => {
    return Math.round((val1 / val2) * 100);
  }
    
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
      {
        parts.map((printer:any, i:any) => printer.parts.length > 0 ? (
          <tr key={i} className="">
            <td className="">{printer.printerName}</td>
            <td className="">{printer.productNumber}</td>
            <td className="">
              <ul className="">
                {
                  printer.parts.map((part:any) => 
                    <li key={part.partsName} className="py-2 w-full flex flex-row justify-between">
                      <span className="w-[120px] p-2">{part.partsName}</span> 
                      <span className="w-2/3 flex flex-col items-center">
                        <span>{part.part.length} of {part.maxParts}</span>
                        <Progress value={calcPercent(part.part.length, part.maxParts)} className="h-2"  />
                      </span>
                    </li>
                  )
                }
              </ul>
            </td>
            <td className="text-center">
              <Link href={`/parts/${printer._id}`} className="bg-primary-500 p-3 rounded-lg">View</Link>
            </td>
          </tr>
        ) : (null)) 
      }
      
        {/* {parts.map((printer:any, i:any) =>
          printer.parts.length > 0 ? (
            printer.parts.map((part: any) =>
              part.part.length > 0 ? (
                part.part.map((item: any, index: number) => (
                  <tr key={`${printer._id}-${part.partsName}-${index}`} className="mb-4 h-14 font-bold border-b-0">
                    <td className="font-bold text-white">{printer.printerName}</td>
                    <td className="">{printer.productNumber}</td>
                    <td className="">{part.partsName}</td>
                    <td className="">{part.location || "Location not set"}</td>
                  </tr>
                ))
              ) : (
                <tr key={`${printer._id}-${part.partsName}`}>
                  <td className="font-bold">{printer.printerName}</td>
                  <td className="">{printer.productNumber}</td>
                  <td className="">{part.partsName}</td>
                  <td className="">No Parts Available</td>
                </tr>
              )
            )
          ) 
          : (
            <tr key={printer._id} className="h-14 font-bold">
              <td className="font-bold text-white">{printer.printerName}</td>
              <td className="">{printer.productNumber}</td>
              <td className="">No Parts Available</td>
              <td className="">{printer.location || "Location not set"}</td>
            </tr>
          )
        )} */}
      





    </>
  )
}

export default DisplayParts