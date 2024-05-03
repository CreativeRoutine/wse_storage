import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
// import { getPrinters } from "@/lib/actions/printer.action";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs"
import VisitorNotification from "@/components/shared/VisitorNotification";
import CreatePalet from "@/components/shared/pallets/CreatePalet";
import CreatePrinter from "@/components/shared/printers/CreatePrinter";

const addPrinter = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))

  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  return (
    <>
      <Title text="Add new printer" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 gap-4">
        <div className="w-full mt-1">
          <CreatePrinter mongoUserId={mongoUser._id} />
          
          
        </div>

      </div>
    </>
  );
};

export default addPrinter;
