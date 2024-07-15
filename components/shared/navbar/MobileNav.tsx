import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

// Delete this after import real links
import { sidebarLinks } from "@/constants";

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-6 pt-16 ">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        // TODO

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-white"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : ""}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      {/* Hamburger Button */}
      <SheetTrigger asChild>
        <Image
          src="/images/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="sm:hidden"
        />
      </SheetTrigger>

      {/* Mobile Nav */}
      <SheetContent side="left" className="bg-black text-white  border-none">
        <Link href="/" className="flex items-center gap-1">
          {/* Logo */}
          <Image src="/images/logo.png" width={48} height={48} alt="DevFlow" className="w-[40px] h-[40px]" />
          {/* Company Name */}
          <p className="h2-bold font-spaceGrotesk text-md">
            <span className="text-white ml-2">WS Electronics</span>
          </p>
        </Link>
        <div className="mobile_nav flex flex-col h-full justify-between">
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          {/* <SignedOut> */}
          <div className="flex flex-col gap-3 mb-10">
            <SheetClose asChild>
            <SignedIn>
              <UserButton afterSignOutUrl="/"/>
            </SignedIn>
              {/* <Link href="/sign-in">
                <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                  <span className="primary-text-gradient">Log In</span>
                </Button>
              </Link> */}
            </SheetClose>

            <SheetClose asChild>
              <SignedOut>
                <SignInButton/>
              </SignedOut>

              {/* <Link href="/sign-up">
                <Button className="small-medium light-border-2 btn-tertiary text-white min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                  Sign Up
                </Button>
              </Link> */}
            </SheetClose>



          </div>
          {/* </SignedOut> */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
