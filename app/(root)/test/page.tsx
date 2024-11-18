import React from "react";
import Image from "next/image";
import Title from "@/components/shared/Title";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import {auth} from "@clerk/nextjs"
import VisitorNotification from "@/components/shared/VisitorNotification";
import AddGenericPart from "@/components/shared/parts/AddGenericPart";
import AddPartToStorage from "@/components/shared/tests/AddPartToStorage";
import { getAllPartsList } from '@/lib/actions/partsList.action';

const addPart = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))

  const partsListResponse = await getAllPartsList()
  console.log(partsListResponse)

  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

  return (
    <>
      <Title text="Test Parts and else" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4 gap-4">
        <div className="w-full mt-1">

        <AddPartToStorage />

        
          
        </div>

      </div>
    </>
  );
};

export default addPart;
