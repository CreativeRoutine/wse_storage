"use server";
import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
import CreatePalet from "@/components/shared/pallets/CreatePalet";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import {auth} from "@clerk/nextjs"
import VisitorNotification from "@/components/shared/VisitorNotification";
import CreateSupplierPallet from "@/components/shared/suppliers/CreateSupplierPallet";

const AddPallet = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))

  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  return (
    <>
      <Title text="Add Pallet and printers" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 lg:gap-4">
        <div className="w-full lg:w-1/2 mt-1">
          <CreatePalet mongoUserId={mongoUser._id} />
        </div>
        <div className="w-full lg:w-1/2 mt-1">
          <CreateSupplierPallet mongoUserId={mongoUser._id} />
        </div>
      </div>
    </>
  );
};

export default AddPallet;
