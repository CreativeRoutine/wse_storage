"use server"
import React from "react";
import Title from "@/components/shared/Title";
import DisplayPallets from "@/components/shared/DisplayPallets";

import {auth} from "@clerk/nextjs"
import Image from 'next/image'
import { getUserById } from '@/lib/actions/user.action'
import { redirect } from "next/navigation";
import VisitorNotification from "@/components/shared/VisitorNotification";

const Storage = async () => {

  const {userId} = auth();
  if(!userId) redirect('/sign-in')
  const mongoUserData = await getUserById({userId})
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
  if(mongoUser.department === "visitor"){
    return(<VisitorNotification />)
  }

    return (
      <>
        <Title text="Storage" />
  
        <DisplayPallets />
        
      </>
    );
};

export default Storage;
