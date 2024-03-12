import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PrintersList } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

const User = () => {
  return (
    <>
      <div className="py-8 px-6 bg-slate-100 rounded-md flex items-center justify-between mb-4 text-xl">
        <h1 className="text-3xl font-black">Tech John's statistic page</h1>
      </div>

      {/* STATISTIC TODAY */}
      <div className="flex flex-row gap-4 mb-4">
        {/* Card #1 */}
        <Card className="w-1/3 border-none shadow-md bg-teal-50">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              John refurbished today:
            </CardTitle>
            <CardDescription className="text-slate-600">
              Printers refurbished today:
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p className="text-emerald-600 font-bold text-6xl">152</p>
            <Badge className="px-5 py-2 bg-green-100 text-slate-800 flex flex-col justify-end items-end">
              <div className="text-sm text-slate-500 mb-1">Average time:</div>
              <div className="flex text-lg">
                <Image
                  // src="/assets/icons/eye.svg"
                  src="/assets/icons/stopwatch.svg"
                  width={20}
                  height={20}
                  alt="Tech"
                  className="invert-colors mr-1"
                />
                19 mins.
              </div>
            </Badge>
          </CardContent>
        </Card>

        {/* Card #2 */}
        <Card className="w-1/3 border-none shadow-md bg-sky-50">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              Refurbished this week:
              {/* <div className="flex items-center justify-center w-6 h-6 rounded-xl">
                <Link href="/" key="tech">
                  <Image
                    // src="/assets/icons/eye.svg"
                    src="/assets/icons/arrow-up-right.svg"
                    width={20}
                    height={30}
                    alt="Tech"
                    className="fill-green-500 stroke-slate-500"
                  />
                </Link>
              </div> */}
            </CardTitle>
            <CardDescription className="text-slate-600">
              Printers refurbished this week
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p className="text-sky-500 font-bold text-6xl">68</p>
            <Badge className="px-5 py-2 bg-sky-100 text-slate-800 flex flex-col justify-end items-end">
              <div className="text-sm text-slate-500 mb-1">Average time</div>
              <div className="flex text-lg">
                <Image
                  // src="/assets/icons/eye.svg"
                  src="/assets/icons/stopwatch.svg"
                  width={20}
                  height={20}
                  alt="Tech"
                  className="invert-colors mr-1"
                />
                22 mins.
              </div>
            </Badge>
          </CardContent>
        </Card>

        {/* Card #3 */}
        <Card className="w-1/3 border-none shadow-md bg-purple-50">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              Total:
              {/* <div className="flex items-center justify-center w-6 h-6 rounded-xl">
                <Link href="/" key="tech">
                  <Image
                    // src="/assets/icons/eye.svg"
                    src="/assets/icons/arrow-up-right.svg"
                    width={20}
                    height={30}
                    alt="Tech"
                    className="fill-green-500 stroke-slate-500"
                  />
                </Link>
              </div> */}
            </CardTitle>
            <CardDescription className="text-slate-600">
              Total printers made / returns
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p className="text-purple-500 font-bold text-6xl">
              372 <span className="text-xl text-red-500">/ 18</span>{" "}
            </p>
            <Badge className="px-5 py-2 bg-purple-100 text-slate-800 flex flex-col justify-end items-end">
              <div className="text-sm text-slate-500 mb-1">Returns</div>
              <div className="flex text-lg">
                <Image
                  // src="/assets/icons/eye.svg"
                  src="/assets/icons/pie.svg"
                  width={20}
                  height={20}
                  alt="Tech"
                  className="invert-colors mr-1"
                />
                0.4 %
              </div>
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="py-4 px-6 bg-slate-100 rounded-md flex items-center justify-between mb-4 text-xl">
        <h3 className="text-2xl font-bold">Printers by John:</h3>
      </div>

      <div className="mb-4 bg-slate-100 rounded-md py-6">
        <div className="flex flex-row px-6 pb-4 font-semibold text-md border-b-2 border-slate-600 w-full">
          <span className="w-[80px] ">Printer</span>
          <span className="flex flex-1 justify-center pl-3">
            Start/End Time
          </span>
          <span className="flex flex-1 justify-center ">Time spent</span>
          <span className="flex flex-1 justify-center ">Costs</span>
          <span className="flex flex-1 justify-center ">Parts Changed</span>
          <span className="flex flex-1 justify-end  pr-2">Average time</span>
          <span className="flex flex-1 justify-end  pr-2">Printer profile</span>
        </div>

        <div className="w-full">
          {PrintersList.map((printer) => {
            return (
              <div
                className="flex flex-row justify-center items-center pt-3 pb-3 px-6 border-b border-slate-200 hover:bg-slate-300"
                key={printer.id}
              >
                <span className="w-[80px] flex flex-col justify-center items-center">
                  <Image
                    src="/assets/printers_preview/281.png"
                    width={60}
                    height={60}
                    alt="Printer"
                    className=""
                  />
                  {printer.make}
                </span>
                <span className="flex flex-1 justify-center pl-3">
                  {printer.techStart} / {printer.techEnd}
                </span>
                <span className="flex flex-1 justify-center ">
                  {printer.techTime} mins.
                </span>
                <span className="flex flex-1 justify-center items-end font-bold">
                  {printer.price}
                  <span className="text-slate-400 text-xs pl-2 font-normal">
                    USD{" "}
                  </span>
                </span>
                <span className="flex flex-1 justify-center ">
                  {printer.partsReplaced.length}
                </span>
                <span className="flex flex-1 justify-end  pr-2">
                  Average time
                </span>
                <span className="flex flex-1 justify-end ">
                  <Link
                    href="/printer"
                    className="px-4 py-3 bg-transparent font-bold border-2 border-slate-600 rounded-full hover:border-none hover:bg-sky-600 hover:text-white"
                  >
                    Full info
                  </Link>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default User;
