"use server";
import React from "react";
import Title from "@/components/shared/Title";
import CreatePalet from "@/components/shared/pallets/CreatePalet";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";


const AddPallet = async () => {

  // const userId = '12345'
  // if(!userId) redirect('/sign-in')

  // const mongoUser = await getUserById({userId})

  return (
    <>
      <Title text="Add Pallet and printers" />
      
      <div className="flex bg-dark-600 rounded-xl border border-dark-350 p-4">
        <div className="w-full mt-1">
          <CreatePalet mongoUserId={"12345"} />
        </div>
      </div>
    </>
  );
};

export default AddPallet;
