// "use server"
// import React from "react";
// import Title from "@/components/shared/Title";
// import DisplayPallets from "@/components/shared/DisplayPallets";
// import { getPallets } from "@/lib/actions/pallet.action";

// import {auth} from "@clerk/nextjs"
// import Image from 'next/image'
// import { getUserById } from '@/lib/actions/user.action'
// import { redirect } from "next/navigation";
// import VisitorNotification from "@/components/shared/VisitorNotification";
// import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

// import { SearchParamsProps } from "@/types";

// const Storage = async ({searchParams}: SearchParamsProps) => {

//   const {userId} = auth();
//   if(!userId) redirect('/sign-in')
//   const mongoUserData = await getUserById({userId})
//   const mongoUser = JSON.parse(JSON.stringify(mongoUserData))
  
//   if(mongoUser.department === "visitor"){
//     return(<VisitorNotification />)
//   }

//   const resultPallets = await getPallets({})
//   const pallets = JSON.parse(JSON.stringify(resultPallets.pallets))

//     return (
//       <>
//         <Title text="Storage" />

//         <LocalSearchbar 
//           route="/storage" 
//           iconPosition="left" 
//           imgSrc="/assets/icons/search.svg" 
//           placeholder="Filter items by make, product number, serial number, PO number or barcode" 
//           otherClasses="mb-4 bg-dark-600 text-white"
//         /> 
  
//         <DisplayPallets 
//           pallets={pallets} 
//         />
        
//       </>
//     );
// };

// export default Storage;


import React from "react";
import Title from "@/components/shared/Title";
import DisplayPallets from "@/components/shared/DisplayPallets";
import { getPallets } from "@/lib/actions/pallet.action";

import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import VisitorNotification from "@/components/shared/VisitorNotification";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { SearchParamsProps } from "@/types";

const Storage = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongoUserData = await getUserById({ userId });
  const mongoUser = JSON.parse(JSON.stringify(mongoUserData));

  if (mongoUser.department === "visitor") {
    return <VisitorNotification />;
  }

  const resultPallets = await getPallets({
    searchQuery: searchParams.q, // Передаем параметр поиска
  });

  const pallets = JSON.parse(JSON.stringify(resultPallets.pallets));

  return (
    <>
      <Title text="Storage" />

      {/* Local Searchbar */}
      <LocalSearchbar
        route="/storage"
        iconPosition="left"
        imgSrc="/assets/icons/search.svg"
        placeholder="Filter pallets by printer name"
        otherClasses="mb-4 bg-dark-600 text-white"
      />

      {/* Display Pallets */}
      <DisplayPallets pallets={pallets} />
    </>
  );
};

export default Storage;