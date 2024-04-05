import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddPrinterForm from "@/components/shared/forms/AddPrinterForm";
import Title from "@/components/shared/Title";
import { getPrinters } from "@/lib/actions/printer.action";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import TechWorkPrinterForm from "@/components/shared/forms/TechWorkPrinterForm";

const addPrinter = async () => {
  // const {userId} = auth();
  const userId = "12345"
  if (!userId) redirect('/sign-in')
  const mongoUser = await getUserById({userId});

  const resultPrinters = await getPrinters({})
  const printers = JSON.parse(JSON.stringify(resultPrinters))

  return (
    <>
      <Title text="Add Printer" />
      

      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 gap-4">
        <div className="w-1/2">
          {/* <TechWorkPrinterForm mongoUserId={JSON.stringify(mongoUser._id)} /> */}
          
        </div>


        <div className="w-1/2">
          {/* <AddPrinterForm mongoUserId={JSON.stringify(mongoUser._id)} /> */}
        </div>

      </div>
    </>
  );
};

export default addPrinter;
