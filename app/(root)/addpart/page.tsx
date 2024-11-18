import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs"
import VisitorNotification from "@/components/shared/VisitorNotification";
import AddGenericPart from "@/components/shared/parts/AddGenericPart";
import { getAllPartsModels } from "@/lib/actions/parts.action";

const addPart = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))

  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  const partResponse = await getAllPartsModels({})
  const parts = JSON.parse(JSON.stringify(partResponse))
  // console.log("PARTS =====>",parts)

  async function choosePartName(productNumber: string){
    console.log("productNumber ===>",productNumber)

  }

  return (
    <>
      <Title text="Add new part" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 gap-4">
        <div className="w-full mt-1">
          <AddGenericPart parts={parts} />
          
        </div>

      </div>
    </>
  );
};

export default addPart;
