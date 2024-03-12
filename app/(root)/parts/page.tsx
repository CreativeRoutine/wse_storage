import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { printerParts } from "@/constants";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <>
      <div className="py-4 px-6 bg-slate-100 rounded-md flex items-center justify-between">
        <h1>Parts</h1>
        <Button className="primary-gradient rounded-lg text-white">
          Add part
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-md mt-8">
        {printerParts.map((part) => {
          let partsMax =
            part.leftSideMax +
            part.rightSideMax +
            part.topMax +
            part.screensMax +
            part.frontMax +
            part.rearDoorsMax +
            part.traysMax +
            part.fuserMax +
            part.rollsMax;
          let partsAvailable =
            part.leftSide +
            part.rightSide +
            part.top +
            part.screens +
            part.front +
            part.rearDoors +
            part.trays +
            part.fuser +
            part.rolls;

          const partsPerc = Math.round((partsAvailable / partsMax) * 100);
          const partsAll = partsMax - partsAvailable;

          return (
            <>
              <Card
                key={part.model}
                className="  border-none shadow-md bg-slate-50 px-3 py-3 mb-3"
              >
                <CardHeader className="">
                  <CardTitle className="mb-3 flex justify-between">
                    <div className="flex items-center justify-between rounded-xl">
                      <Link href="/printer">{part.model}</Link>
                    </div>
                    <div className="flex flex-col items-end text-base ">
                      <span
                        className={`rounded-xl text-white px-2 py-2 ${
                          partsPerc < 50
                            ? "bg-red-500"
                            : partsPerc < 80
                            ? "bg-yellow-500"
                            : partsPerc < 100
                            ? "bg-green-300"
                            : "bg-green-600"
                        }`}
                      >
                        {partsPerc} %
                      </span>
                      <span className="text-xs mt-1 text-slate-400">
                        {partsAvailable === partsMax
                          ? "All parts available"
                          : partsAll + " - parts needed"}
                      </span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-slate-600"></CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-end">
                  <ul>
                    <li className="text-base font-semibold text-slate-500">
                      Left side:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.leftSide}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.leftSideMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Right side:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.rightSide}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.rightSideMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Top:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.top}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.topMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Screens:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.screens}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.screensMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Front:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.front}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.frontMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Rear doors:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.rearDoors}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.rearDoorsMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Trays:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.trays}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.traysMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Fuser:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.fuser}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.fuserMax}
                        </span>
                      </span>
                    </li>
                    <li className="text-base font-semibold text-slate-500">
                      Rolls:{" "}
                      <span className="font-bold text-lg text-slate-900 ml-4">
                        {part.rolls}{" "}
                        <span className="text-sm text-slate-400">
                          {" "}
                          / {part.rollsMax}
                        </span>
                      </span>
                    </li>
                  </ul>
                  <Image
                    src="/assets/printers_preview/281.png"
                    alt={part.model}
                    width={100}
                    height={100}
                  />
                </CardContent>
              </Card>
            </>
          );
        })}
      </div>
    </>
  );
};

export default Dashboard;
