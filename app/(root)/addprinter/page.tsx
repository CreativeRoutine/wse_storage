import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
// import { getPrinters } from "@/lib/actions/printer.action";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs"
import VisitorNotification from "@/components/shared/VisitorNotification";

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
      <Title text="Work with printer" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 gap-4">
        <div className="w-1/2">
          
          
          
        </div>


        <div className="w-1/2">
          
        </div>

      </div>
    </>
  );
};

export default addPrinter;
