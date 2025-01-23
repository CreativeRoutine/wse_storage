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
import Loading from "./loading";
import { getData } from "@/lib/actions/printer.action";
import { SearchParamsProps } from "@/types";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { PrintersFilters } from "@/components/printers/PrintersFilters";
import dayjs from "dayjs";

const Home = async ({searchParams}: SearchParamsProps) => {
  
    const { userId } = auth();
    if (!userId) redirect("/sign-in");
  
    const mongoUserData = await getUserById({ userId });
    const mongoUser = JSON.parse(JSON.stringify(mongoUserData));
  
    const printers = await getData();
  
    const {
      totalPrinters,
      totalPallets,
      refurbishedToday,
      refurbishedThisWeek,
      cleanedToday,
      cleanedThisWeek,
    } = printers;
  
    return (
      <>
        <Title text="Dashboard" />
  
        <div className="flex gap-4 bg-dark-600 rounded-xl border border-dark-350 p-4 ">
          {/* Storage */}
          <div className="card w-1/3 bg-dark-300 rounded-xl border border-dark-350 px-6 py-4">
            <div className="w-full text-white font-semibold text-lg mt-2">Storage</div>
            <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
              <div>
                {totalPrinters} <span className="text-base font-normal">printers</span>
              </div>
              <div>
                {totalPallets} <span className="text-base font-normal">pallets</span>
              </div>
            </div>
          </div>
  
          {/* Refurbished */}
          <div className="card w-1/3 bg-dark-400 rounded-xl border border-dark-350 px-6 py-4">
            <div className="w-full text-white font-semibold text-lg mt-2">Printers refurbished</div>
            <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
              <div>
                <div className="text-sm mb-2">Today:</div>
                <div>
                  {refurbishedToday} <span className="text-base font-normal">printers</span>
                </div>
              </div>
              <div>
                <div className="text-sm mb-2">This week:</div>
                <div>
                  {refurbishedThisWeek} <span className="text-base font-normal">printers</span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Cleaned */}
          <div className="card w-1/3 bg-dark-300 rounded-xl border border-dark-350 px-6 py-4">
            <div className="w-full text-white font-semibold text-lg mt-2">Printers cleaned</div>
            <div className="text-4xl text-white font-semibold mt-8 mb-4 flex justify-between">
              <div>
                <div className="text-sm mb-2">Today:</div>
                <div>
                  {cleanedToday} <span className="text-base font-normal">printers</span>
                </div>
              </div>
              <div>
                <div className="text-sm mb-2">This week:</div>
                <div>
                  {cleanedThisWeek} <span className="text-base font-normal">printers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  


export default Home;
