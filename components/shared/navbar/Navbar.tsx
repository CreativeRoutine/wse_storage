"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input"
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
// import NavbarDark from "@/components/dark_with_search";

const Navbar = () => {
  

  return (
    <nav className="flex mx-auto pb-4 pt-8 w-full items-center justify-between border-b-2 border-dark-500 bg-dark-100">


      <GlobalSearch />

      <div className=" text-white flex gap-3 justify-center items-center">
          <Link href="/addpallet" className="hover:bg-primary-500 hover:border-0 border border-white bg-black rounded-lg px-4 py-4">Add Pallet</Link>
          <Link href="/addprinter" className="hover:bg-primary-500 hover:border-0 border border-white bg-black rounded-lg px-4 py-4">Add Printer</Link>
        {/* Theme Switch */}
        {/* <Theme /> */}
        
          <div className="h-[32px]">
            <SignedIn>
              <UserButton afterSignOutUrl="/"/>
            </SignedIn>
          </div>
        <SignedOut>
          <SignInButton/>
        </SignedOut>
          
        
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
