"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signUserOut } from "@/lib/actions/auth";

const Header = () => {
  const path = usePathname();

  return (
    <header className="my-10 flex items-center justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="Log" width="40" height="40" />
      </Link>

      <div className="flex flex-row gap-6 text-white font-ibm-plex-sans items-center">
        <Link
          href={"/"}
          className={cn(
            "font-semibold",
            !path.includes("/search") &&
              !path.includes("/profile") &&
              "text-light-200",
          )}
        >
          Home
        </Link>
        <Link
          href={"/search"}
          className={cn(
            "font-semibold",
            path.includes("/search") &&
              !path.includes("/profile") &&
              "text-light-200",
          )}
        >
          Search
        </Link>

        <Link
          href={"/profile"}
          className={cn(
            "font-semibold",
            !path.includes("/search") &&
              path.includes("/profile") &&
              "text-light-200",
          )}
        >
          Profile
        </Link>

        <a
          className={
            "my-2 cursor-pointer flex gap-1 items-center font-ibm-plex-sans"
          }
          onClick={() => signUserOut()}
        >
          <Image
            src={"/icons/logout.svg"}
            alt={"admin"}
            width={22}
            height={22}
          />
        </a>
      </div>
    </header>
  );
};
export default Header;
