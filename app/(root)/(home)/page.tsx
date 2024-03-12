import React from "react";
import Image from "next/image";
import { PrintersList } from "@/constants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const printers = [
  {
    model: 1300,
    made: 419,
    technician: "John Doe",
    cleaner: "David Miller",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 1320,
    made: 493,
    technician: "Emma Wilson",
    cleaner: "Isabella Anderson",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 1515,
    made: 371,
    technician: "Daniel Lee",
    cleaner: "Isabella Anderson",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 148,
    made: 265,
    technician: "James Taylor",
    cleaner: "Jane Smith",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 130,
    made: 105,
    technician: "John Doe",
    cleaner: "David Miller",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 252,
    made: 416,
    technician: "James Taylor",
    cleaner: "David Miller",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 255,
    made: 232,
    technician: "John Doe",
    cleaner: "Jane Smith",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 277,
    made: 107,
    technician: "Emma Wilson",
    cleaner: "Jane Smith",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 452,
    made: 323,
    technician: "Maria Garcia",
    cleaner: "Isabella Anderson",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 454,
    made: 148,
    technician: "Alex Johnson",
    cleaner: "David Miller",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 477,
    made: 243,
    technician: "Daniel Lee",
    cleaner: "Isabella Anderson",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 479,
    made: 208,
    technician: "Maria Garcia",
    cleaner: "Jane Smith",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 4014,
    made: 206,
    technician: "Alex Johnson",
    cleaner: "Jane Smith",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 4015,
    made: 113,
    technician: "Olivia Martinez",
    cleaner: "Isabella Anderson",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: false,
  },
  {
    model: 4200,
    made: 341,
    technician: "Emma Wilson",
    cleaner: "David Miller",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 4250,
    made: 125,
    technician: "Emma Wilson",
    cleaner: "Jane Smith",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 4300,
    made: 349,
    technician: "James Taylor",
    cleaner: "David Miller",
    partReplacements: true,
    completedOn: "2023-05-22",
    sold: true,
  },
  {
    model: 4300,
    made: 252,
    technician: "Olivia Martinez",
    cleaner: "Michael Brown",
    partReplacements: false,
    completedOn: "2023-05-22",
    sold: true,
  },
];

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      {/* STATISTIC TODAY */}
      <div className="flex flex-row gap-4">
        {/* Card #1 */}
        <Card className="w-1/3 border-none shadow-md bg-teal-50  ">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              Techs
              <div className="flex items-center justify-center w-6 h-6 rounded-xl">
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
              </div>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Printers refurbished today
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p className="text-emerald-600 font-bold text-6xl">15</p>
            <Badge className="px-5 py-2 bg-green-100 text-green-800">
              <Image
                // src="/assets/icons/eye.svg"
                src="/assets/icons/icons/arrow-up.svg"
                width={12}
                height={12}
                alt="Tech"
                className="fill-green-800 mr-1"
              />
              12 %
            </Badge>
          </CardContent>
        </Card>

        {/* Card #2 */}
        <Card className="w-1/3 border-none shadow-md bg-sky-50  bg-blend-soft-light">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              Cleaners
              <div className="flex items-center justify-center w-6 h-6 rounded-xl">
                <Link href="/" key="tech">
                  <Image
                    // src="/assets/icons/eye.svg"
                    src="/assets/icons/arrow-up-right.svg"
                    width={20}
                    height={20}
                    alt="Tech"
                    className="fill-green-800"
                  />
                </Link>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Printers cleaned today
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <p
              className="
            text-sky-500 
            font-bold 
            text-6xl"
            >
              23
            </p>
            <Badge className="px-5 py-2 bg-sky-100 text-blue-800">
              <Image
                // src="/assets/icons/eye.svg"
                src="/assets/icons/icons/arrow-down.svg"
                width={12}
                height={12}
                alt="Tech"
                className="fill-red-800 mr-1"
              />
              6 %
            </Badge>
          </CardContent>
        </Card>

        {/* Card #3 */}
        <Card className="w-1/3 border-none shadow-md bg-purple-50  bg-blend-soft-light">
          <CardHeader>
            <CardTitle className="mb-3 flex justify-between">
              Done all time
              <div className="flex items-center justify-center w-6 h-6 rounded-xl">
                <Link href="/" key="tech">
                  <Image
                    // src="/assets/icons/eye.svg"
                    src="/assets/icons/arrow-up-right.svg"
                    width={20}
                    height={20}
                    alt="Tech"
                    className="fill-green-800"
                  />
                </Link>
              </div>
            </CardTitle>
            <CardDescription className="text-slate-600">
              Done all time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end items-end">
            <p className="text-purple-500 font-bold text-6xl">1463</p>
          </CardContent>
        </Card>
      </div>

      {/* PRINTERS' LIST FOR TODAY */}
      <div className="  flex flex-row justify-start gap-5 py-2 mt-[64px] mb-[8px]">
        {/* <Button className="bg-slate-500 text-white">Printers</Button> */}
        <Select>
          <SelectTrigger className="w-[180px] primary-gradient text-white px-7 py-6 outline-none font-bold text-lg">
            <SelectValue
              placeholder="by Date"
              className="outline-none font-bold"
            />
          </SelectTrigger>
          <SelectContent className="bg-white text-sky-600 pt-2 pb-2 outline-none font-bold text-base">
            <SelectItem value="oldest" className="">
              Oldest
            </SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] primary-gradient text-white px-7 py-6 outline-none font-bold text-lg">
            <SelectValue placeholder="by Printers" className="outline-none" />
          </SelectTrigger>
          <SelectContent className="bg-white text-sky-600 pt-2 pb-2 outline-none font-bold">
            <SelectItem value="1320">1320</SelectItem>
            <SelectItem value="1350">1350</SelectItem>
            <SelectItem value="2055">2055</SelectItem>
            <SelectItem value="401">401</SelectItem>
            <SelectItem value="402">402</SelectItem>
            <SelectItem value="404">404</SelectItem>
            <SelectItem value="426">426</SelectItem>
            <SelectItem value="451">451</SelectItem>
            <SelectItem value="452">452</SelectItem>
            <SelectItem value="477">477</SelectItem>
            <SelectItem value="501">501</SelectItem>
            <SelectItem value="553">553</SelectItem>
            <SelectItem value="1102">1102</SelectItem>
            <SelectItem value="1525">1525</SelectItem>
            <SelectItem value="4015">4015</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className=" mx-auto flex flex-col">
        <Table>
          {/* TABLE HEAD */}
          <TableHeader className="bg-black text-white rounded--md">
            <TableRow className="">
              <TableHead className="text-left w-[30px]">#</TableHead>
              <TableHead className="flex items-center">
                Printers
                <Image
                  src="/assets/icons/icons/chevron-down.svg"
                  width={12}
                  height={12}
                  alt="Tech"
                  className="ml-4"
                />
              </TableHead>
              <TableHead className="text-right">Tech</TableHead>
              <TableHead className="text-right">Tech time</TableHead>
              <TableHead className="text-right">Cleaner</TableHead>
              <TableHead className="text-right">Cleaner time</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>

          {/* TABLE BODY */}
          <TableBody>
            {/* ROW #1 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#1.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4350</Link>
              </TableCell>
              <TableCell className="text-right">John</TableCell>
              <TableCell className="text-right">45 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">23 mins.</TableCell>
              <TableCell className="text-right">68 mins.</TableCell>
            </TableRow>

            {/* ROW #2 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#2.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4014</Link>
              </TableCell>
              <TableCell className="text-right">Tom</TableCell>
              <TableCell className="text-right">34 mins.</TableCell>
              <TableCell className="text-right">Hanna</TableCell>
              <TableCell className="text-right">12 mins.</TableCell>
              <TableCell className="text-right">46 mins.</TableCell>
            </TableRow>

            {/* ROW #3 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#3.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">1525</Link>
              </TableCell>
              <TableCell className="text-right">Andy</TableCell>
              <TableCell className="text-right">14 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">6 mins.</TableCell>
              <TableCell className="text-right">20 mins.</TableCell>
            </TableRow>

            {/* ROW #4 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#4.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4350</Link>
              </TableCell>
              <TableCell className="text-right">John</TableCell>
              <TableCell className="text-right">45 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">23 mins.</TableCell>
              <TableCell className="text-right">68 mins.</TableCell>
            </TableRow>

            {/* ROW #5 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#5.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4014</Link>
              </TableCell>
              <TableCell className="text-right">Tom</TableCell>
              <TableCell className="text-right">34 mins.</TableCell>
              <TableCell className="text-right">Hanna</TableCell>
              <TableCell className="text-right">12 mins.</TableCell>
              <TableCell className="text-right">46 mins.</TableCell>
            </TableRow>

            {/* ROW #6 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#6.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">1525</Link>
              </TableCell>
              <TableCell className="text-right">Andy</TableCell>
              <TableCell className="text-right">14 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">6 mins.</TableCell>
              <TableCell className="text-right">20 mins.</TableCell>
            </TableRow>

            {/* ROW #7 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#7.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4350</Link>
              </TableCell>
              <TableCell className="text-right">John</TableCell>
              <TableCell className="text-right">45 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">23 mins.</TableCell>
              <TableCell className="text-right">68 mins.</TableCell>
            </TableRow>

            {/* ROW #8 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#8.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4014</Link>
              </TableCell>
              <TableCell className="text-right">Tom</TableCell>
              <TableCell className="text-right">34 mins.</TableCell>
              <TableCell className="text-right">Hanna</TableCell>
              <TableCell className="text-right">12 mins.</TableCell>
              <TableCell className="text-right">46 mins.</TableCell>
            </TableRow>

            {/* ROW #9 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#9.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">1525</Link>
              </TableCell>
              <TableCell className="text-right">Andy</TableCell>
              <TableCell className="text-right">14 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">6 mins.</TableCell>
              <TableCell className="text-right">20 mins.</TableCell>
            </TableRow>

            {/* ROW #10 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#10.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4350</Link>
              </TableCell>
              <TableCell className="text-right">John</TableCell>
              <TableCell className="text-right">45 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">23 mins.</TableCell>
              <TableCell className="text-right">68 mins.</TableCell>
            </TableRow>

            {/* ROW #11 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#11.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">4014</Link>
              </TableCell>
              <TableCell className="text-right">Tom</TableCell>
              <TableCell className="text-right">34 mins.</TableCell>
              <TableCell className="text-right">Hanna</TableCell>
              <TableCell className="text-right">12 mins.</TableCell>
              <TableCell className="text-right">46 mins.</TableCell>
            </TableRow>

            {/* ROW #12 */}
            <TableRow>
              <TableCell className="font-medium text-slate-400">#12.</TableCell>
              <TableCell className="font-medium">
                <Link href="/printer/_id">1525</Link>
              </TableCell>
              <TableCell className="text-right">Andy</TableCell>
              <TableCell className="text-right">14 mins.</TableCell>
              <TableCell className="text-right">Helen</TableCell>
              <TableCell className="text-right">6 mins.</TableCell>
              <TableCell className="text-right">20 mins.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Home;
