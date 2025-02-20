"use client";

import {settingsLinks} from "@/constants/index";
import Link from "next/link";
import { usePathname } from "next/navigation";




// import { SignedOut, useAuth } from "@clerk/nextjs";

const SetingsNav = () => {
  //   const { userId } = useAuth();
  const pathname = usePathname();
  const isActive = true;
  return (

    <>
      <section className="flex  justify-start  ">


        {/* Navigation Buttons */}
        
        {settingsLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          return (
            
              <Link
              href={`/settings/${item.route}`}
              key={item.label}
              className={`${
                isActive
                  ? "bg-primary-500 text-white border-primary-500"
                  : "text-white bg-transparent hover:bg-primary-500 hover:border-primary-500 border border-white bg-black px-4 py-4"
              }  flex items-center justify-start mr-4 p-4 rounded-lg`}
            >

              <p
                className=" base-bold max-lg:hidden"
              >
                {item.label}
              </p>
            </Link>
            
            
          );
        })}
        

        

      </section>
    </>
  );
};

export default SetingsNav;
