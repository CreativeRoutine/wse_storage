import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PrintersList } from "@/constants";
import Image from "next/image";
import Link from "next/link";

const Printer = () => {
  const id = "1";

  const printer =  [
    // replace to id
    { serial: "1243221" },
    { serial: "1246322" },
    { serial: "2985633" },
    { serial: "7123634" },
  ];

  return (
    <>
      {/* HEADING */}
      <div className="py-4 px-8 bg-slate-100 rounded-2xl flex items-center justify-between mb-4 border-slate-200 shadow-md">
        <h1 className="text-2xl font-semibold">Printer's page</h1>
        <Link href="/parts" className="text-sky-500">
          Parts
        </Link>
      </div>

      {/* PRINTER GENERAL INFO */}
      <div className="flex flex-row gap-6 mb-2">
        {/* LEFT CARD */}
        {/* GENERAL INFO */}
        <div className="py-8 px-8 bg-slate-100 gap-5 rounded-2xl flex flex-1 flex-row  mb-4 text-xl shadow-md">
          {/* LEFT SIDE */}
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col text-sm ml-4">
              <div className="flex text-slate-400">
                <div>Make:</div>
                <div className="font-bold text-base text-slate-600 pl-3">
                   281 DN
                </div>
              </div>
              <div className="flex text-slate-400">
                <div>Printer serial:</div>
                <div className="font-bold text-base text-slate-600 pl-3">
                  {/* {printer.serial} */}
                  12345678
                </div>
              </div>
            </div>
            <Image
              src="/assets/printers_preview/281.png"
              width={280}
              height={280}
              alt="Tech"
              // className="shadow-md rounded-xl bg-sky-100"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 flex-col justify-start items-start mt-8 text-base ">
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Tech:</div>
              <div>
                John
                {/* {printer.techId} */}
              </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Tech's time:</div>
              <div>
                42
                {/* {printer.techTime} */}
                </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Cleaner:</div>
              <div>
                Helen
                {/* {printer.cleanerId} */}
                </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Cleaner's time:</div>
              <div>
                16
                {/* {printer.cleanerTime} */}
                </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Parts Changed:</div>
              <div>
              4
                {/* {printer.partsReplaced.length} */}
                </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Average time:</div>
              <div>
                {/* {printer.techTime + printer.cleanerTime}  */}
              58 mins. </div>
            </div>
            <div className="mb-3 flex w-full flex-row justify-between border-b border-dotted border-slate-300">
              <div>Costs:</div>
              <div>
                125$
                {/* {printer.price} */}
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        {/* PARTS CHANGED */}
        <div className=" py-8 px-8 bg-gradient-to-r from-sky-500 to-indigo-500 text-white gap-5 rounded-2xl flex flex-col flex-1 mb-4 text-xl shadow-md">
          {/* HEADING */}
          <div className=" flex flex-row justify-between">
            <h2 className="text-2xl font-bold">Parts used</h2>
            <div className="h-10 w-10 rounded-full bg-sky-400 flex justify-center items-center">
              4
              {/* {printer.partsReplaced.length} */}
            </div>
          </div>

          {/* LIST OF PARTS */}
          <div className="">
            <ul className="text-base ">
              {printer.map((part) => (
                <li
                  key={part.serial}
                  className="mb-3 flex flex-row bg-sky-700 rounded-full px-5 py-3 "
                >
                  <div className="mr-6 ">
                    Part:
                    <span className="font-bold text-md pl-2">Left side</span>
                  </div>
                  <div className="mr-6">
                    Serial num.:
                    <span className="font-bold text-md pl-2">
                      {part.serial}
                    </span>
                  </div>
                  <div>
                    Part cost:
                    <span className="font-bold text-md pl-2">5$</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        {/* TOTAL COSTS */}
        <div className="flex items-stretch  w-1/3 flex-col bg-lime-200 rounded-2xl py-8 px-8">
          <h2 className="text-3xl font-bold text-lime-900 mb-6">
            Profitness :
          </h2>
          <div className="bg-lime-100 border-2 border-lime-100 rounded-xl px-4 py-6">
            Time (mins):{" "}
            <span className="text-6xl text-lime-700 font-bold border-4 border-white rounded-full px-6 py-6">
              42
              <div className="text-sm">26 / 16</div>
            </span>
          </div>
          <div>Parts cost - USD {20}</div>
          <div className="text-3xl self-end">Acceptable!</div>
        </div>
      </div>
    </>
  );
};

export default Printer;
