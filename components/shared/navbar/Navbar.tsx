"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input"

import MobileNav from "./MobileNav";
import { Button } from "@/components/ui/button";
// import NavbarDark from "@/components/dark_with_search";

const Navbar = () => {
  return (
    <nav className="flex mx-auto pb-4 pt-8 w-full items-center justify-between border-b-2 border-dark-500">


      {/* <GlobalSearch /> */}
      <div className="flex flex-row h-12 w-[268px] relative">
        <Image className="absolute left-5 top-3.5 stroke-3" width={18} height={18} src="/assets/icons/search.svg" alt="search"/>
        <Input 
        className="px-4 pl-12 h-12 text-base bg-dark-600 border-none shadow-md rounded-3xl focus:outline-none" 
        placeholder="Search ..."
        />
        
      </div>

      <div className=" text-white flex gap-3">
          <Link href="/addpallet" className="hover:bg-primary-500 hover:border-0 border border-white bg-black rounded-lg text-white px-4 py-4">Add Pallet</Link>
          <Link href="/addprinter" className="hover:bg-primary-500 hover:border-0 border border-white bg-black rounded-lg text-white px-4 py-4">Start Printer</Link>
        {/* Theme Switch */}
        {/* <Theme /> */}
        {/* <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#ff7000",
              },
            }}
          />
        </SignedIn> */}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;