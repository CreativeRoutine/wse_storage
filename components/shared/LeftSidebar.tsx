"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {Button} from "@/components/ui/button";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";


// import { SignedOut, useAuth } from "@clerk/nextjs";

const LeftSidebar = () => {
  //   const { userId } = useAuth();
  const pathname = usePathname();
  const isActive = true;
  return (

    <>
      <section id="sidebar" className="bg-dark-200 custom-scrollbar fixed left-0 top-0 flex h-screen flex-col justify-start overflow-y-auto border-r border-dark-300 pt-12 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[395px]">

        <Link className="logo flex flex-col justify-start items-center pl-10 pr-10" href="/" >
          <div className="flex self-start flex-row items-center">
          <div className="flex justify-center items-center h-10 w-10 bg-primary-500 rounded-lg">
          <Image width={32} height={32} src="/assets/logo.png" alt="logo" />
          </div>
          <p className="text-white pl-2.5 font-bold uppercase">WSElectronics</p>
          </div>
          <div className="border-b-2 border-dark-500 h-[2px] w-full mt-7"></div>
        </Link>

        {/* Navigation Buttons */}
        <div className="flex flex-1 flex-col gap-6 pl-10 pr-10 mt-12 ">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          // this code for
          // if (item.route === "/profile") {
          //   if (userId) {
          //     item.route = `${item.route}/${userId}`;
          //   } else {
          //     return null;
          //   }
          // }

          return (
            item.route === "/settings" ? (
              <div key={item.label}>
              <div className="border-b-2 border-dark-500 h-[2px] w-full mt-3 mb-3"></div>
              <Link
              href={item.route}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-slate-200 "
              }  flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                // className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className=" base-bold max-lg:hidden"
              >
                {item.label}
              </p>
            </Link>
              </div>
            ) : (
              <Link
              href={item.route}
              key={item.label}
              className={`${
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "text-slate-200 "
              }  flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                // className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className=" base-bold max-lg:hidden"
              >
                {item.label}
              </p>
            </Link>
            )
            
          );
        })}
        

        </div>

        <SignedOut>
        <div className="flex flex-col gap-3 pl-10 pr-10 mb-8">
          <Link href="/sign-in">
            <Button className="w-full primary-gradient rounded-lg text-white">
              <Image
                src="/assets/icons/account.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className=" max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="max-lg:hidden">Sign up</span>
            </Button>
          </Link>
        </div>
        </SignedOut>

      </section>
    </>
  );
};

export default LeftSidebar;
