import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
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

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs"
import { getUserById } from "@/lib/actions/user.action";
import VisitorNotification from "@/components/shared/VisitorNotification";

import DisplayPrinters from "@/components/shared/DisplayPrinters";

export default async function  Home () {


  // time pale created


  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(
      <>
        <VisitorNotification />
      </>
    )
  }
    return (
      <>
        {/* STATISTIC TODAY */}
        <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4">
          {/* Card #1 */}
          {/* <Card className="w-1/3 border-none shadow-md bg-dark-600  py-4 px-3">
            <CardHeader>
              <CardTitle className="flex justify-between text-white">
                Techs
                <div className="flex items-center justify-center w-6 h-6 rounded-xl">
                  <Link href="/" key="tech">
                    <Image
                      src="/assets/icons/arrow-up-right.svg"
                      width={20}
                      height={30}
                      alt="Tech"
                      className="fill-green-500 stroke-slate-500"
                    />
                  </Link>
                </div>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Printers refurbished today
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-end">
              <p className="text-emerald-400 font-bold text-6xl">15</p>
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
          </Card> */}
  
          {/* Card #2 */}
          {/* <Card className="w-1/3 border-none shadow-md bg-dark-600  py-4 px-3">
            <CardHeader>
              <CardTitle className="mb-3 flex justify-between text-white">
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
              <CardDescription className="text-slate-300">
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
          </Card> */}
  
          {/* Card #3 */}
          {/* <Card className="w-1/3 border-none shadow-md bg-dark-600  py-4 px-3">
            <CardHeader>
              <CardTitle className="mb-3 flex justify-between text-white">
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
              <CardDescription className="text-slate-300">
                Done all time
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end items-end">
              <p className="text-purple-500 font-bold text-6xl">1463</p>
            </CardContent>
          </Card> */}
        </div>
        <div className="mt-4 bg-dark-600 rounded-xl border border-dark-350 p-4 text-white">

        </div>
      </>
    );

    
};

